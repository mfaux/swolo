import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  LabelWithoutUserId,
  ProjectWithLabels,
  TaskWithLabels,
} from '@/db/types';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const statuses = ['To Do', 'In Progress', 'Done'];

type TaskEditorProps = {
  task: TaskWithLabels;
  projects: ProjectWithLabels[];
  onClose: () => void;
};

const colorOptions = [
  { name: 'Red', value: 'red' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
];

export default function TaskEditor({
  task,
  projects,
  onClose,
}: TaskEditorProps) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || '');
  const [projectId, setProjectId] = useState(task.projectId || '');
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [labels, setLabels] = useState<LabelWithoutUserId[]>(task.labels || []);
  const [files, setFiles] = useState<File[]>([]); // TODO: files support
  const [openLabels, setOpenLabels] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(colorOptions[0].value);

  const [isExpanded, setIsExpanded] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleAddLabel = (label: LabelWithoutUserId) => {
    if (!labels.some((l) => l.name === label.name)) {
      setLabels([...labels, label]);
    }
    setOpenLabels(false);
  };

  const handleRemoveLabel = (labelToRemove: LabelWithoutUserId) => {
    setLabels(labels.filter((label) => label.name !== labelToRemove.name));
  };

  const handleCreateLabel = () => {
    if (newLabelName) {
      const newLabel: LabelWithoutUserId = {
        name: newLabelName,
        id: null, // This will be set by the backend
        color: newLabelColor,
      };
      handleAddLabel(newLabel);
      setNewLabelName('');
      setNewLabelColor(colorOptions[0].value);
    }
  };

  return (
    <Card className="w-full max-w-4xl relative">
      <Button
        variant="ghost"
        className="absolute right-2 top-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle>New Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="text-lg font-semibold"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Save</Button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
            <div className="space-y-6 md:col-span-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {labels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="secondary"
                      className="text-sm"
                      style={{ backgroundColor: label.color || undefined }}
                    >
                      {label.name}
                      <button
                        onClick={() => handleRemoveLabel(label)}
                        className="ml-2 text-xs"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Popover open={openLabels} onOpenChange={setOpenLabels}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start mt-2"
                    >
                      {labels.length > 0 ? 'Add more labels' : 'Add labels'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Command>
                      <CommandInput placeholder="Search labels..." />
                      <CommandEmpty>No label found.</CommandEmpty>
                      <CommandGroup heading="Existing Labels">
                        {labels.map((label) => (
                          <CommandItem
                            key={label.name}
                            onSelect={() => handleAddLabel(label)}
                            className="flex items-center"
                          >
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{
                                backgroundColor: label.color || undefined,
                              }}
                            />
                            {label.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Create New Label">
                        <div className="p-2">
                          <Input
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            placeholder="New label name"
                            className="mb-2"
                          />
                          <RadioGroup
                            value={newLabelColor}
                            onValueChange={setNewLabelColor}
                            className="flex justify-between mb-2"
                          >
                            {colorOptions.map((color) => (
                              <div
                                key={color.value}
                                className="flex items-center"
                              >
                                <RadioGroupItem
                                  value={color.value}
                                  id={color.value}
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor={color.value}
                                  className="w-8 h-8 rounded-full cursor-pointer"
                                  style={{ backgroundColor: color.value }}
                                />
                              </div>
                            ))}
                          </RadioGroup>
                          <Button
                            onClick={handleCreateLabel}
                            className="w-full"
                          >
                            Create Label
                          </Button>
                        </div>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer mt-2"
                >
                  <input {...getInputProps()} />
                  <p>Attachments</p>
                </div>
                {files.length > 0 && (
                  <ul className="list-disc pl-5">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file)}
                        >
                          <X size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-6 md:border-l md:pl-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={`w-full justify-start text-left font-normal ${!dueDate && 'text-muted-foreground'}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate || undefined}
                      onSelect={(day) => setDueDate(day || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Additional Information</Label>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Created at:{' '}
                    {task.createdAt
                      ? format(new Date(task.createdAt), 'PPP')
                      : 'N/A'}
                  </p>
                  <p>
                    Updated at:{' '}
                    {task.updatedAt
                      ? format(new Date(task.updatedAt), 'PPP')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show details
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
