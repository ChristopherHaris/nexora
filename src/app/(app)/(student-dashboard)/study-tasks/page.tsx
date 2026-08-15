"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckSquare, ListTodo, Plus, Calendar as CalendarIcon, Clock, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudyTasksPage() {
  const trpc = useTRPC();
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    category: "Tugas Kuliah",
    deadline: "",
    checklists: [{ taskName: "", isCompleted: false }],
  });

  const { data: tasks, isLoading, refetch } = useQuery(
    trpc.studyTasks.getTasks.queryOptions({ category: activeCategory })
  );

  const createTaskMutation = useMutation(trpc.studyTasks.createTask.mutationOptions());
  const updateChecklistMutation = useMutation(trpc.studyTasks.updateChecklist.mutationOptions());
  const deleteTaskMutation = useMutation(trpc.studyTasks.deleteTask.mutationOptions());

  const handleCreateTask = async () => {
    if (!newTaskForm.title) return;
    try {
      await createTaskMutation.mutateAsync({
        title: newTaskForm.title,
        category: newTaskForm.category,
        deadline: newTaskForm.deadline,
        checklists: newTaskForm.checklists.filter(c => c.taskName.trim() !== ""),
      });
      setIsModalOpen(false);
      setNewTaskForm({
        title: "",
        category: "Tugas Kuliah",
        deadline: "",
        checklists: [{ taskName: "", isCompleted: false }],
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const addChecklistField = () => {
    setNewTaskForm({
      ...newTaskForm,
      checklists: [...newTaskForm.checklists, { taskName: "", isCompleted: false }]
    });
  };

  const updateChecklistField = (index: number, value: string) => {
    const newChecklists = [...newTaskForm.checklists];
    newChecklists[index].taskName = value;
    setNewTaskForm({ ...newTaskForm, checklists: newChecklists });
  };

  const handleToggleChecklist = async (taskId: string, checklistId: string, currentStatus: boolean) => {
    await updateChecklistMutation.mutateAsync({
      taskId,
      checklistId,
      isCompleted: !currentStatus
    });
    refetch();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync({ taskId });
    refetch();
  };

  const categories = ["Semua", "Tugas Kuliah", "Proyek Sampingan", "Organisasi", "Lainnya"];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-[#ECA823] p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <CheckSquare className="w-4 h-4" /> Study Tasks
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Task Manager
          </h1>
          <p className="text-base font-bold text-slate-900/80 max-w-xl">
            Catat tugas deadline, buat sampingan aja, dan pantau progress checklist mu di sini!
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-12 bg-white text-black hover:bg-slate-100"
          >
            <Plus className="w-5 h-5 mr-2" /> Buat Task Baru
          </Button>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-black uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
              activeCategory === cat ? 'bg-primary text-white shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tasks?.length === 0 ? (
          <div className="col-span-full border-4 border-dashed border-slate-300 p-12 text-center rounded-2xl">
            <ListTodo className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase text-slate-400">Belum Ada Task</h3>
            <p className="text-slate-400 font-bold mt-2">Buat task baru untuk mulai mencatat progressmu.</p>
          </div>
        ) : (
          tasks?.map((task: any) => {
            const completedCount = task.checklists.filter((c: any) => c.isCompleted).length;
            const totalCount = task.checklists.length;
            const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
            
            return (
              <div key={task.id} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 border-2 border-black rounded-md mb-2 inline-block">
                      {task.category}
                    </span>
                    <h3 className="text-2xl font-black uppercase text-slate-900 leading-tight">{task.title}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {task.deadline && (
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-6 bg-slate-50 border-2 border-slate-200 p-2 rounded-lg w-fit">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span>Deadline: {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

                {/* Progress Bar */}
                {totalCount > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-black uppercase text-slate-500">Progress</span>
                      <span className="text-sm font-black text-primary">{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 border-2 border-black rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full border-r-2 border-black ${progress === 100 ? 'bg-[#00FF41]' : 'bg-[#00FFFF]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklists */}
                <div className="space-y-3 flex-grow">
                  {task.checklists.map((checklist: any) => (
                    <label 
                      key={checklist.id} 
                      className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        checklist.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-black hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={checklist.isCompleted}
                        onChange={() => handleToggleChecklist(task.id, checklist.id, checklist.isCompleted)}
                        className="mt-1 w-5 h-5 accent-primary border-2 border-black rounded-sm cursor-pointer"
                      />
                      <span className={`font-bold ${checklist.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {checklist.taskName}
                      </span>
                    </label>
                  ))}
                  {task.checklists.length === 0 && (
                    <p className="text-sm font-bold text-slate-400 italic">Tidak ada sub-task.</p>
                  )}
                </div>

                {task.status === "COMPLETED" && (
                  <div className="mt-6 pt-4 border-t-4 border-black text-center text-[#00FF41] font-black uppercase flex items-center justify-center gap-2">
                    <CheckSquare className="w-5 h-5" /> Task Selesai
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white border-4 border-black p-6 sm:p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Buat Task Baru</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">Tambahkan task dan pecah menjadi checklist kecil.</p>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Judul Task</label>
                  <Input 
                    placeholder="e.g. Tugas Besar PBO"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                    className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Kategori</label>
                    <Select value={newTaskForm.category} onValueChange={(val) => setNewTaskForm({...newTaskForm, category: val})}>
                      <SelectTrigger className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black font-bold">
                        {categories.filter(c => c !== "Semua").map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-black uppercase text-slate-900 mb-1 block">Deadline</label>
                    <Input 
                      type="date"
                      value={newTaskForm.deadline}
                      onChange={(e) => setNewTaskForm({...newTaskForm, deadline: e.target.value})}
                      className="border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-900 mb-2 block">Checklists (Sub-Tasks)</label>
                  <div className="space-y-3">
                    {newTaskForm.checklists.map((cl, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          placeholder={`Item checklist ${idx + 1}`}
                          value={cl.taskName}
                          onChange={(e) => updateChecklistField(idx, e.target.value)}
                          className="border-2 border-black rounded-lg font-bold"
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={addChecklistField}
                      className="w-full border-2 border-dashed border-slate-300 font-bold text-slate-500 hover:border-black hover:text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Checklist
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t-4 border-black">
                  <Button 
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleCreateTask}
                    disabled={!newTaskForm.title || createTaskMutation.isPending}
                    className="flex-1 bg-primary text-white border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                  >
                    {createTaskMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Task"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
