"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, Plus, Trash2, Utensils, Pencil, X, Check,
  ImagePlus, Coffee, Beef, Cookie, IceCream,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

type MenuType = "food" | "drink" | "snack" | "dessert";

type MenuItemFormData = {
  id?: string;
  name: string;
  type: MenuType;
  basePrice: string | number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
};

const TYPE_LABELS: Record<MenuType, { label: string; color: string; Icon: any }> = {
  food:    { label: "Food",     color: "bg-orange-100 text-orange-800 border-orange-300", Icon: Beef },
  drink:   { label: "Drinks",   color: "bg-blue-100 text-blue-800 border-blue-300",       Icon: Coffee },
  snack:   { label: "Snacks",   color: "bg-yellow-100 text-yellow-800 border-yellow-300", Icon: Cookie },
  dessert: { label: "Desserts", color: "bg-pink-100 text-pink-800 border-pink-300",       Icon: IceCream },
};

const EMPTY_FORM: MenuItemFormData = {
  name: "",
  type: "food",
  basePrice: "",
  description: "",
  imageUrl: "",
  isAvailable: true,
};

function MenuFormModal({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: MenuItemFormData;
  onSave: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<MenuItemFormData>(initial ?? EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const update = (key: keyof MenuItemFormData, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg bg-white border-4 border-border rounded-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-border bg-[#ECA823]">
          <h2 className="text-lg font-black uppercase text-slate-900">
            {form.id ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-black/10 rounded-base">
            <X className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-black uppercase mb-2 text-slate-700">
              Menu Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-base border-2 border-border bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {form.imageUrl ? (
                  <Image src={form.imageUrl} alt="preview" width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <ImagePlus className="w-7 h-7 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <UploadButton
                  endpoint="menuImage"
                  onUploadBegin={() => setUploading(true)}
                  onClientUploadComplete={(res) => {
                    setUploading(false);
                    const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
                    if (uploadedUrl) update("imageUrl", uploadedUrl);
                    toast.success("Photo uploaded successfully!");
                  }}
                  onUploadError={(err) => {
                    setUploading(false);
                    toast.error("Failed to upload photo: " + err.message);
                  }}
                  appearance={{
                    button: "bg-slate-900 text-white font-black uppercase text-xs px-4 py-2 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform ut-uploading:opacity-60",
                    allowedContent: "text-xs font-bold text-slate-400 mt-1",
                  }}
                  content={{ button: uploading ? "Uploading..." : "Upload Photo" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1 text-slate-700">Menu Name *</label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Special Fried Rice"
                className="border-2 border-border h-11 font-bold focus-visible:ring-0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1 text-slate-700">Category *</label>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value as MenuType)}
                className="w-full h-11 border-2 border-border rounded-base px-3 font-bold bg-white outline-none focus:border-slate-900 text-sm"
              >
                <option value="food">Food</option>
                <option value="drink">Drinks</option>
                <option value="snack">Snacks</option>
                <option value="dessert">Desserts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-slate-700">Price (Rp) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">Rp</span>
              <Input
                type="number"
                min={0}
                value={form.basePrice}
                onChange={(e) => update("basePrice", e.target.value === "" ? "" : parseInt(e.target.value))}
                placeholder="15000"
                className="border-2 border-border h-11 font-bold pl-9 focus-visible:ring-0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-slate-700">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your delicious menu item..."
              className="border-2 border-border font-bold focus-visible:ring-0 resize-none text-sm"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-dashed border-border rounded-base">
            <div>
              <p className="font-black text-slate-900 text-sm uppercase">Available for Ordering</p>
              <p className="text-xs font-bold text-slate-400">Toggle off when item is out of stock</p>
            </div>
            <Switch
              checked={form.isAvailable}
              onCheckedChange={(v) => update("isAvailable", v)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t-4 border-border">
          <Button
            variant="outline"
            className="flex-1 border-2 font-black uppercase"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-slate-900 text-white font-black uppercase border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
            disabled={isPending || uploading || !form.name || !form.basePrice}
            onClick={() => onSave(form)}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : form.id ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PartnerMenuManagementView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<null | "add" | MenuItemFormData>(null);

  const { data: menuItems, isLoading } = useQuery(trpc.tenants.getMenuItems.queryOptions());

  const invalidate = () => queryClient.invalidateQueries(trpc.tenants.getMenuItems.pathFilter());

  const addMutation = useMutation({
    ...trpc.tenants.addMenuItem.mutationOptions(),
    onSuccess: () => { toast.success("Menu item added successfully!"); invalidate(); setModalState(null); },
    onError: (e: any) => toast.error(e.message || "Failed to add menu item"),
  });

  const updateMutation = useMutation({
    ...trpc.tenants.updateMenuItem.mutationOptions(),
    onSuccess: () => { toast.success("Menu item updated successfully!"); invalidate(); setModalState(null); },
    onError: (e: any) => toast.error(e.message || "Failed to update menu item"),
  });

  const deleteMutation = useMutation({
    ...trpc.tenants.deleteMenuItem.mutationOptions(),
    onSuccess: () => { toast.success("Menu item deleted"); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Failed to delete menu item"),
  });

  const toggleMutation = useMutation({
    ...trpc.tenants.updateMenuItem.mutationOptions(),
    onSuccess: () => invalidate(),
    onError: (e: any) => toast.error(e.message),
  });

  const handleSave = (form: MenuItemFormData) => {
    const payload = {
      name: form.name,
      type: form.type,
      basePrice: Number(form.basePrice),
      description: form.description,
      isAvailable: form.isAvailable,
    };
    if (form.id) {
      updateMutation.mutate({ id: form.id, ...payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ECA823]" />
      </div>
    );
  }

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full">
      {modalState !== null && (
        <MenuFormModal
          initial={modalState === "add" ? undefined : modalState}
          onSave={handleSave}
          onCancel={() => setModalState(null)}
          isPending={isPending}
        />
      )}

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Menu Management</h1>
          <p className="font-bold text-slate-500 mt-1">
            {menuItems?.length ?? 0} {menuItems?.length === 1 ? "item" : "items"} registered
          </p>
        </div>
        <Button
          onClick={() => setModalState("add")}
          className="bg-[#ECA823] hover:bg-yellow-500 text-slate-900 font-black uppercase border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform rounded-base"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Menu Item
        </Button>
      </div>

      {!menuItems || menuItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-dashed border-border rounded-base">
          <Utensils className="w-12 h-12 text-slate-300 mb-4" />
          <p className="font-black text-slate-500 uppercase">No menu items yet</p>
          <p className="text-sm font-bold text-slate-400 mt-1">Add your first menu item to get started</p>
          <Button
            onClick={() => setModalState("add")}
            className="mt-6 bg-[#ECA823] hover:bg-yellow-500 text-slate-900 font-black uppercase border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Menu Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {menuItems.map((item: any) => {
            const meta = TYPE_LABELS[item.type as MenuType] ?? TYPE_LABELS.food;
            const TypeIcon = meta.Icon;
            return (
              <div
                key={item.id}
                className="bg-white border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col hover:-translate-y-1 transition-transform"
              >
                <div className="relative w-full h-36 bg-slate-100 flex items-center justify-center overflow-hidden border-b-4 border-border">
                  {item.image?.url ? (
                    <Image src={item.image.url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <TypeIcon className="w-12 h-12 text-slate-200" />
                  )}
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-0.5 rounded-base border-2 border-border text-xs font-black uppercase ${item.isAvailable ? "bg-green-400" : "bg-red-400"} text-slate-900`}>
                      {item.isAvailable ? "Available" : "Sold Out"}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black text-slate-900 uppercase leading-tight line-clamp-2 flex-1">
                      {item.name}
                    </p>
                    <span className={`shrink-0 text-xs font-black uppercase px-2 py-0.5 rounded-base border-2 ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs font-bold text-slate-500 line-clamp-2">{item.description}</p>
                  )}

                  <p className="text-xl font-black text-slate-900 mt-auto">
                    Rp{Number(item.basePrice).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex border-t-4 border-border">
                  <button
                    className="flex-1 py-2.5 text-xs font-black uppercase text-slate-600 hover:bg-[#ECA823] hover:text-slate-900 transition-colors border-r-2 border-border flex items-center justify-center gap-1.5"
                    onClick={() =>
                      setModalState({
                        id: item.id,
                        name: item.name,
                        type: item.type,
                        basePrice: item.basePrice,
                        description: item.description ?? "",
                        imageUrl: item.image?.url ?? "",
                        isAvailable: item.isAvailable ?? true,
                      })
                    }
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    className={`flex-1 py-2.5 text-xs font-black uppercase transition-colors border-r-2 border-border flex items-center justify-center gap-1.5 ${
                      item.isAvailable
                        ? "text-red-500 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() =>
                      toggleMutation.mutate({ id: item.id, isAvailable: !item.isAvailable })
                    }
                    disabled={toggleMutation.isPending}
                  >
                    {item.isAvailable ? (
                      <><X className="w-3.5 h-3.5" /> Disable</>
                    ) : (
                      <><Check className="w-3.5 h-3.5" /> Enable</>
                    )}
                  </button>
                  <button
                    className="flex-1 py-2.5 text-xs font-black uppercase text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                    onClick={() => {
                      if (confirm(`Delete "${item.name}"?`)) deleteMutation.mutate({ id: item.id });
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
