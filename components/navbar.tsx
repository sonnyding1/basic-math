import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Menu} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    title: string;
}

const routes = [
    {
        name: 'Addition',
        path: '/addition'
    },
    {
        name: 'Multiplication',
        path: '/multiplication'
    },
    {
        name: 'Factorization',
        path: '/factorization'
    }
]

export default function Navbar({ title }: NavbarProps) {
    const auth = useAuth();
    const pathname = usePathname();

    return (
        <div className='p-4 flex justify-between'>
        <div className='flex gap-4 items-center'>
          {/* menu bar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-[1.2rem] w-[1.2rem]' />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col pt-4'>
                {routes.map(route => (
                    <Link key={route.path} href={route.path}>
                        <p className={cn('p-2 rounded-md hover:bg-gray-200', pathname === route.path ? 'font-semibold': '')}>{route.name}</p>
                    </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <h1 className='text-4xl font-bold'>{title}</h1>
        </div>
        <div className='flex gap-4 items-center'>
          <DarkModeToggle />
          {auth.isSignedIn && <UserButton afterSignOutUrl='/' />}
          {!auth.isSignedIn && 
            <Link href={'/sign-in'}>
              <Button>Sign In</Button>
            </Link>}
        </div>
      </div>
    )
}