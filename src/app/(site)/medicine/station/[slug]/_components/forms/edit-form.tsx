// import { zodResolver } from '@hookform/resolvers/zod';
// import { Loader2 } from 'lucide-react';
// import type { Dispatch, SetStateAction } from 'react';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';

// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { getPerson } from '@/libs/utils';

// const formSchema = z.object({
//   name: z.string().min(1),
//   role: z.string().min(1),
//   description: z.string().min(1),
// });

// export default function EditForm({
//   cardId,
//   setIsOpen,
// }: {
//   cardId: string;
//   setIsOpen: Dispatch<SetStateAction<boolean>>;
// }): React.JSX.Element {
//   const person = getPerson(cardId);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: person?.name,
//       role: person?.role,
//       description: person?.description,
//     },
//   });

//   const isLoading = form.formState.isSubmitting;
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setIsOpen(false);
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.log(error);
//     }
//     // eslint-disable-next-line no-console
//     console.log(values);
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col space-y-2 px-4 sm:px-0"
//       >
//         <FormField
//           name="name"
//           control={form.control}
//           render={({ field }: { field: any }) => (
//             <FormItem className="col-span-2 md:col-span-1">
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder="John Doe"
//                   // className="text-md"
//                   required
//                   // eslint-disable-next-line jsx-a11y/no-autofocus
//                   autoFocus
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="role"
//           control={form.control}
//           render={({ field }: { field: any }) => (
//             <FormItem className="col-span-2 md:col-span-1">
//               <FormLabel>Role</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder="Developer"
//                   // className="text-md"
//                   required
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="description"
//           control={form.control}
//           render={({ field }: { field: any }) => (
//             <FormItem className="col-span-2 md:col-span-1">
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea
//                   {...field}
//                   placeholder="John has been coding for 10 years."
//                   // className="text-md"
//                   required
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="mt-4 flex w-full sm:justify-end">
//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="w-full sm:w-auto"
//           >
//             <>
//               {isLoading
//                 ? (
//                     <>
//                       <Loader2 className="mr-2 size-4 animate-spin" />
//                       Saving...
//                     </>
//                   )
//                 : (
//                     'Save'
//                   )}
//             </>
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
