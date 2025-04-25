import { useState } from "react";
//import { Combobox } from "@headlessui/react";
import { cn } from "@/lib/utils";  // Asegúrate de tener una función 'cn' para manejar clases condicionales

const SelectWithSearch: React.FC = () => {
  const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grapes"];
  const [query, setQuery] = useState("");
  const filteredOptions = query === "" ? options : options.filter(option => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-64">
      {/* <Combobox as="div" value={query} onChange={setQuery}>
        <Combobox.Input
          className="w-full p-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(event:any) => setQuery(event.target.value)}
          placeholder="Search..."
        />
        <Combobox.Options className="w-full mt-1 overflow-y-auto bg-white border rounded-md shadow-lg max-h-48">
          {filteredOptions.length === 0 && query !== "" ? (
            <Combobox.Option value="" disabled className="p-2 text-gray-500">
              No results found
            </Combobox.Option>
          ) : (
            filteredOptions.map((option, index) => (
              <Combobox.Option key={index} value={option} className="p-2 cursor-pointer hover:bg-indigo-200">
                {option}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox> */}
    </div>
  );
};

export default SelectWithSearch;
