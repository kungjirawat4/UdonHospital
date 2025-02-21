import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  drugId: z.string(),
});

export default function DeleteForm({
  drugId,
  setIsOpen,
}: {
  drugId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugId,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6  px-4 sm:px-0"
      >
        <div className="flex w-full justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="hidden w-full sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-400"
          >
            {isLoading
              ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Deleting
                  </>
                )
              : (
                  <span>Delete</span>
                )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
