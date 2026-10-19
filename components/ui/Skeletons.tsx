import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function ResourceCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col h-full rounded-xl">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start mb-3">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="grow pb-5 px-5 space-y-3 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-5 px-5 border-t border-gray-50 flex gap-2">
        <div className="h-9 flex-1 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-9 flex-1 bg-gray-200 rounded-lg animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export function ActivityCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row h-full md:h-56 rounded-xl">
      <div className="md:w-1/3 shrink-0 h-48 md:h-full bg-gray-200 animate-pulse" />
      <div className="md:w-2/3 p-5 md:p-6 flex flex-col justify-between w-full">
        <div>
          <div className="flex gap-4 mb-3">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="pt-5 mt-auto flex items-center justify-between border-t border-gray-50">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </Card>
  )
}

export function TutorialCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col h-full rounded-xl">
      <div className="relative aspect-video w-full bg-gray-200 animate-pulse" />
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        <div className="mt-auto pt-5 flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function GalleryItemSkeleton() {
  return (
    <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 animate-pulse w-full"></div>
  )
}

export function AnnouncementCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col h-full rounded-xl">
      <div className="h-48 w-full bg-gray-200 animate-pulse shrink-0" />
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="grow px-5 space-y-2">
        <div className="h-3.5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3.5 w-4/5 bg-gray-200 rounded animate-pulse" />
      </CardContent>
      <CardFooter className="pt-4 pb-5 px-5 border-t border-gray-50 flex items-center">
        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gray-200 animate-pulse mb-4" />
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}
