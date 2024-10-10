'use client'

import { Paperclip, Plus, ArrowUp } from 'lucide-react';
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"


const NewTaskDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <div className="pt-1 flex items-center space-x-2 gap-1">
          <button
            className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Paperclip className="h-4 w-5" />
          </button>
          <Input autoFocus className="flex-grow" placeholder='Create a task' />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="images">Images</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit"><ArrowUp /></Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { NewTaskDialog };