'use client';
import { useGridContext } from '@/context/GridContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Scoreboard from '@/components/Scoreboard';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gridInfo } = useGridContext();

  return (
    <div className="container mx-auto p-8 space-y-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">My Grids</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{gridInfo?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Scoreboard gridInfo={gridInfo} />
      {children}
    </div>
  );
}
