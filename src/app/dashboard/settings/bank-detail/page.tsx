"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Setting() {
  return (
    <div className="w-3xl">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Bank Details</FieldLegend>
            <FieldDescription>
              Manage your bank details settings.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Bank Name
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  required
                />
                <FieldDescription>
                  You can edit your bank here.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Account Name
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>
                  You can edit your account name here.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Account Number
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>
                  You can edit your account number here.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* <FieldSeparator /> */}

          <Field orientation="horizontal">
            <Button type="submit">Save</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
