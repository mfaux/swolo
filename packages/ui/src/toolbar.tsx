import { Plus, Search } from "lucide-react";
import { Input } from "@repo/ui/input";
import { NewTaskDialog } from "./new-task-dialog";


type ToolbarProps = {
  //onClick: () => void;
};

const Toolbar = ({}: ToolbarProps) => {
  return (
     <div className="absolute left-1/2 transform -translate-x-1/2 top-3">
      <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit">
        <NewTaskDialog/>

        <div className="mx-2 relative">
          <Search className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pr-8 h-8 w-40 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export { Toolbar };