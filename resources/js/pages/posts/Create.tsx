
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm} from '@inertiajs/react';
import { Loader2 } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Post',
        href: '/posts/create',
    },
];

export default function Dashboard() {
    const {data, setData, post, errors, processing} = useForm<{
        title:string,
        category:string,
        status:string,
        content:string,
        image: File | null,
    }>({
        title:'',
        category:'',
        status:'',
        content:'',
        image:  null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        post('/posts');


    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='rounded border p-6 shadow-xl'>


                    <div className='mb-5 flex items-center justify-between'>
                           <div className="text-xl text-slate-600">
                                 Create Post
                            </div>
                            <Button>
                                <Link href='/posts'>
                                   Go Back
                                </Link>
                            </Button>

                    </div>
                            <Card>
                                <CardContent>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='col-span-2'>
                                                <Label htmlFor='title'>title</Label>
                                                <Input type='text' id='title'
                                                 value={data.title}
                                                 placeholder='title..'
                                                 onChange={(e)=> setData('title',e.target.value)}
                                                 aria-invalid={!!errors.title} />
                                                 <InputError message={errors.title}  />

                                            </div>

                                            <div className='col-span-2 md:col-span-1' >
                                                <Label htmlFor='category'>category</Label>
                                                <Select value= {data.category}

                                                onValueChange={(e)=> setData('category', e)} >
                                                     <SelectTrigger aria-invalid={!!errors.category} id='category'   className="w-full">
                                                       <SelectValue placeholder="Select Category" />
                                                     </SelectTrigger>
                                                     <SelectContent>
                                                       <SelectItem value="light"></SelectItem>
                                                       <SelectItem value="dark">Dark</SelectItem>
                                                       <SelectItem value="system">System</SelectItem>
                                                     </SelectContent>
                                                   </Select>
                                                   <InputError message={errors.category}  />

                                            </div>

                                            <div className='col-span-2 md:col-span-1'>
                                                <Label htmlFor='status'>status</Label>
                                                <Select  value= {data.status}
                                                onValueChange={(e)=> setData('status', e)}>
                                                     <SelectTrigger aria-invalid={!!errors.status} id='category'   className="w-full">
                                                       <SelectValue placeholder="Select Category" />
                                                     </SelectTrigger>
                                                     <SelectContent>
                                                       <SelectItem value="1">Active</SelectItem>
                                                       <SelectItem value="0">Inactive</SelectItem>

                                                     </SelectContent>
                                                   </Select>
                                                   <InputError message={errors.status}  />

                                            </div>

                                            <div className='mt-4'>
                                                <Label htmlFor='content'>content</Label>
                                                <Textarea aria-invalid={!!errors.content}  value={data.content}
                                                 onChange={e=> setData('content',e.target.value)}
                                                 rows={6} id='content' placeholder='Type Content here......' />
                                                 <InputError message={errors.content}  />

                                            </div>

                                            <div className='col-span-2'>
                                                <Label htmlFor='image'>Image</Label>
                                                <Input
                                                 onChange={e=> {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setData('image',file);

                                                    }
                                                 }
                                                 }
                                                 type='file' id='image' aria-invalid={!!errors.image} />
                                                 <InputError message={errors.image}  />
                                                 {data.image &&(<img src={URL.createObjectURL(data.image)}
                                                 alt='preview' className='mt-2 w-32 object-cover rounded-lg'
                                                 />)}
                                            </div>

                                            <div className='mt-4 text-end'>
                                                <Button size={'lg'}
                                                 className='mb-5 flex items-center justify-between'
                                                disabled={processing}
                                                type='submit'>
                                                    {processing && <Loader2 className='animate-spin' />}
                                                    <span>Create Posts</span>
                                                </Button>

                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>


                </div>

            </div>
        </AppLayout>
    );
}
