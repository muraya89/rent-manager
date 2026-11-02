import { OccupiedSwitchProps } from "@/app/Types/unit";
import { Label, FormGroup, Input } from "reactstrap";

export function OccupiedSwitch({
  id = "isOccupied",
  checked,
  onChange,
  title = "This unit is occupied",
  description = "Turn on to add the tenant and lease now. You can also do this later.",
}: OccupiedSwitchProps) {
  return (
    <div className="occupied-switch">
      <FormGroup switch className="m-0">
        <Input
          id={id}
          type="switch"
          role="switch"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={`${id}-description`}
        />
      </FormGroup>

      <Label for={id} className="d-flex flex-col">
        <strong>{title}</strong>
        <span id={`${id}-description`}>{description}</span>
      </Label>
    </div>
  );
}

export default OccupiedSwitch;
