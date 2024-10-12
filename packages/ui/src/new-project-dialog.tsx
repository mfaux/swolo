'use client'

import { ArrowUp, FolderKanban } from 'lucide-react';
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

type NewProjectDialogProps = {
  onOpenChange: () => void;
}
const NewProjectDialog = ({onOpenChange}:NewProjectDialogProps) => {
  return (
    <Dialog open onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className='flex flex-row items-center gap-1'>
            <FolderKanban  />
            New Project
          </DialogTitle>
        </DialogHeader>
        <div className="pt-1 flex items-center space-x-2 gap-1">
          <Input autoFocus className="flex-grow"  />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="(No parent)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">No parent</SelectItem>
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

export { NewProjectDialog };