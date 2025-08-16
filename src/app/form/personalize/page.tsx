"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state-context";
import type { NameFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";

const genders = ["Boy", "Girl", "Neutral"] as const;

export default function PersonalizePage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  const { control, handleSubmit, watch, setValue } = useForm<Pick<NameFormValues, 'gender' | 'startingLetters' | 'blendParents' | 'parent1Name' | 'parent2Name' | 'matchSibling' | 'siblingName'>>({
    defaultValues: {
      gender: state.formValues.gender,
      startingLetters: state.formValues.startingLetters,
      blendParents: state.formValues.blendParents,
      parent1Name: state.formValues.parent1Name,
      parent2Name: state.formValues.parent2Name,
      matchSibling: state.formValues.matchSibling,
      siblingName: state.formValues.siblingName,
    },
  });

  const blendParents = watch("blendParents");
  const matchSibling = watch("matchSibling");

  function onSubmit(data: Pick<NameFormValues, 'gender' | 'startingLetters' | 'blendParents' | 'parent1Name' | 'parent2Name' | 'matchSibling' | 'siblingName'>) {
    setState({ formValues: data });
    router.push("/form/cultural");
  }

  return (
    <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Personalise the name</CardTitle>
        <CardDescription>Add personal touches to make it uniquely yours.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div>
            <Label className="font-semibold">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {genders.map((gender) => (
                    <Button
                      key={gender}
                      type="button"
                      variant={field.value === gender ? "default" : "secondary"}
                      onClick={() => field.onChange(gender)}
                      className="rounded-full"
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              )}
            />
          </div>

          <div>
            <Label htmlFor="startingLetters" className="font-semibold">Starts with (Optional)</Label>
            <Controller
              name="startingLetters"
              control={control}
              render={({ field }) => <Input id="startingLetters" placeholder="e.g., A, Ra" {...field} className="mt-2" />}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="blend-parents-switch" className="font-semibold">Blend with Parent's name</Label>
                <Controller
                  name="blendParents"
                  control={control}
                  render={({ field }) => <Switch id="blend-parents-switch" checked={field.value} onCheckedChange={field.onChange} />}
                />
            </div>
            {blendParents && (
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="parent1Name"
                        control={control}
                        render={({ field }) => <Input placeholder="First parent" {...field} />}
                    />
                    <Controller
                        name="parent2Name"
                        control={control}
                        render={({ field }) => <Input placeholder="Second parent" {...field} />}
                    />
                </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="match-sibling-switch" className="font-semibold">Match Sibling's name</Label>
                <Controller
                  name="matchSibling"
                  control={control}
                  render={({ field }) => <Switch id="match-sibling-switch" checked={field.value} onCheckedChange={field.onChange} />}
                />
            </div>
            {matchSibling && (
                <Controller
                    name="siblingName"
                    control={control}
                    render={({ field }) => <Input placeholder="e.g., Priya" {...field} />}
                />
            )}
          </div>
          

          <div className="flex justify-end pt-8">
            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-primary-foreground font-bold rounded-xl">
              Next: Cultural
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}