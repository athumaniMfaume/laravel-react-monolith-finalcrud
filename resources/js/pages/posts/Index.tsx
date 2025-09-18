
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {   Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import InertiaPagination from '@/components/inertia-pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface LinksType {
    url: string,
    label: string,
    active: boolean,

}

interface PostType {
    id: number,
    title: string,
    content: string,
    category: string,
    status: string,
    image: string,
}

interface PostsType {
    data: PostType[],
    links: LinksType[],
    from: number,
    to: number,
    total: number,
}

export default function Dashboard({posts}: {posts: PostsType}) {
    const {flash} = usePage<{flash: {message?: string}}>().props;
    console.log(posts);

    useEffect(()=>{
        if (flash.message) {
            // console.log(flash.message);
            toast.success(flash.message);

        }
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/posts', {search: query}, {preserveState:true, replace:true});
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deletePost(id: number) {
        if (confirm('Are you want to delete this post?')) {
            router.delete( `/posts/${id}`);
        }

    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='rounded border p-6 shadow-xl'>
                    <div className='mb-5 flex items-center justify-between'>
                           <div className="relative w-full sm:w-1/3">
                               <Input id={'search'} className="peer ps-9" placeholder="Search....."
                               onChange={onSearchChange}
                               type="search" />
                                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                        <Search size={16} aria-hidden="true" />
                                    </div>
                            </div>
                            <Button>
                                <Link href='/posts/create'>
                                   Create Post
                                </Link>
                            </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.data?.map((post,index)=>(
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{post.title}</TableCell>
                                        <TableCell><img className='w-10 rounded' src={`/storage/${post.image}`} alt={post.title} /></TableCell>
                                        <TableCell>{post.content.substring(0,50)}</TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell>{post.status == '0' ?
                                        (<Badge className='bg-red-500' >Inactive</Badge>) :
                                         (<Badge className='bg-green-500'>Active</Badge>)}
                                         </TableCell>
                                        <TableCell className='space-x-1'>
                                            <Button asChild size={'sm'}>
                                                <Link href={`/posts/${post.id}/edit`}>
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button onClick={()=>deletePost(post.id)} size={'sm'}
                                            variant={'destructive'}> Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}



                                </TableBody>
                            </Table>

                        </CardContent>
                    </Card>
                    <InertiaPagination posts={posts} />


                </div>

            </div>
        </AppLayout>
    );
}

