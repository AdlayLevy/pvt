import { Button } from "@/components/ui/button";

export default function TitleFilterSection(props) {
  return (
    <div>
      <div className="pb-6 text-2xl font-bold text-indigo-800">
        {props.titleSection}
      </div>
      {props.filters && (
        <div className="p-6 bg-gray-50 mb-6 rounded-lg space-y-6">
          <h1 className="text-sm font-bold pb-3">Filters</h1>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 justify-center">
            {props.filters?.map((item, key) => (
              <div key={key}>{item.filter}</div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={props.buttonFunction}>{props.buttonText}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
