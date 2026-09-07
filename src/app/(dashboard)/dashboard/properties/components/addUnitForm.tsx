import { ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Label } from "reactstrap";
import {Formik, Form, Field} from 'formik'
import {createUnit} from "@/app/actions/unit"

export default function AddUnit({ toggle, propertyId }: { toggle: () => void, propertyId: number }) {
  const initialValues = { unitNumber: "", monthlyRent: 0 };
  const MyInput = ({ field, form, ...props }) => {
    return <Input {...field} {...props} />;
  };
  const saveUnit = async (values: typeof initialValues) => {
    const data = {
      propertyId,
      unitNumber: values.unitNumber,
      monthlyRent: values.monthlyRent,
    };
    console.log("data", data);
    try {
      const result = await createUnit(data);
      toggle()
      console.log('result',result)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <ModalHeader toggle={toggle}>Modal title</ModalHeader>
      <ModalBody>
        <Formik initialValues={initialValues} onSubmit={saveUnit}>
          <Form>
            <FormGroup>
              <Field
                component={MyInput}
                name="unitNumber"
                placeholder="Unit Name"
                type="text"
                bsSize="sm"
                required
              />
              <Label for="unitNumber" hidden>
                Email
              </Label>
            </FormGroup>
            <FormGroup>
              <Label hidden for="monthlyRent">
                Monthly Rent
              </Label>
              <Field
                component={MyInput}
                name="monthlyRent"
                placeholder="Unit Monthly Rent"
                type="number"
                bsSize="sm"
                required
              />
            </FormGroup>

            <div className="mt-5 flex justify-end gap-4 border-t border-t-gray-200 pt-3">
              <Button color="primary" type="submit">
                Save
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </div>
          </Form>
        </Formik>
      </ModalBody>
    </>
  );
}
