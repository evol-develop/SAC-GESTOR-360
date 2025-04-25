import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Option {
  label: string
  value: string
}

interface RadioSelectorProps {
  title: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}

 const RadioSelector =({ title, options, value, onChange }: RadioSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base">{title}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex mt-2 space-x-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default RadioSelector;