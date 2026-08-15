"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Store, Sparkles } from "lucide-react";

const tenantSettingsSchema = z.object({
  name: z.string().min(3, "Canteen name must be at least 3 characters"),
  description: z.string().optional(),
  locationDetail: z.string().optional(),
  isOpen: z.boolean(),
});

type TenantSettingsFormValues = z.infer<typeof tenantSettingsSchema>;

export default function PartnerSettingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: tenant, isLoading } = useQuery(trpc.tenants.getMyTenant.queryOptions());

  const form = useForm<TenantSettingsFormValues>({
    resolver: zodResolver(tenantSettingsSchema),
    defaultValues: {
      name: "",
      description: "",
      locationDetail: "",
      isOpen: true,
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        description: tenant.description || "",
        locationDetail: tenant.locationDetail || "",
        isOpen: tenant.isOpen ?? true,
      });
    }
  }, [tenant, form]);

  const updateMutation = useMutation({
    ...trpc.tenants.updateTenant.mutationOptions(),
    onSuccess: () => {
      toast.success("Canteen settings saved successfully!");
      queryClient.invalidateQueries(trpc.tenants.getMyTenant.queryFilter());
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const onSubmit = (data: TenantSettingsFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ECA823]" />
      </div>
    );
  }

  const isCreating = !tenant;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase text-slate-900">
          Canteen Settings
        </h1>
        <p className="font-bold text-slate-500">
          Manage your stall identity and operational status.
        </p>
      </div>

      {isCreating && (
        <div className="p-4 bg-[#ECA823] border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-slate-900 uppercase text-sm">
              New Merchant Setup
            </p>
            <p className="text-xs font-bold text-slate-800">
              Enter your canteen name and details below to activate your stall. Your canteen will immediately appear in the student menu browser!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border-4 border-border rounded-base p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 pb-4 border-b-2 border-border mb-6">
          <Store className="w-5 h-5 text-slate-900" />
          <h2 className="text-lg font-black uppercase text-slate-900">
            Merchant Information
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xs text-slate-700">
                    Canteen / Stall Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ramen Ekspres, Warteg Mahasiswa, Kopi Senja"
                      className="border-2 border-border font-bold focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xs text-slate-700">
                    Short Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Delicious authentic noodles and snacks at student-friendly prices."
                      className="border-2 border-border font-bold focus-visible:ring-0 resize-none text-sm"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xs text-slate-700">
                    Location Details
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Building B Ground Floor, Stall No. 04"
                      className="border-2 border-border font-bold focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOpen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-base border-2 border-border p-4 bg-slate-50">
                  <div className="space-y-0.5">
                    <FormLabel className="font-black uppercase text-sm text-slate-900">
                      Store Status
                    </FormLabel>
                    <FormDescription className="font-bold text-xs text-slate-500">
                      {field.value
                        ? "🟢 Open (Accepting new student orders)"
                        : "🔴 Closed (Not accepting new orders)"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#0F4C3A]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto bg-[#ECA823] hover:bg-yellow-500 text-slate-900 font-black uppercase border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreating ? "Create & Activate Canteen" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
