import CustomInput from "@/components/forms/CustomInput";
import CustomButton from "@/components/ui/Button/Button";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";

export default function DynamicItemList({
  items = [],
  title,
  buttonLabel,
  nameLabel,
  onAdd,
  onRemove,
  onChange,
  errors = {},
  prefix,
  showDefaultCheckbox = false,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="2xl:text-[26px] lg:text-[20px] text-base font-semibold text-black">
          {title}
        </h2>
        <CustomButton
          variant="primary"
          label={buttonLabel}
          onClick={onAdd}
          fullWidth={false}
          className="ml-4"
        />
      </div>
      {items.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm mt-2">
          {items.map((item, index) => (
            <div key={index} className="">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Checkbox */}
                {showDefaultCheckbox && (
                  <div className="md:col-span-2 flex items-center h-full">
                    <div className="">
                      <CustomCheckbox
                        name={`${prefix}_${index}_isDefault`}
                        label="Mark as Default"
                        value={!!item.isDefault}
                        onChange={(e) => onChange(index, "isDefault", e.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Name */}
                <div
                  className={
                    showDefaultCheckbox ? "md:col-span-4" : "md:col-span-5"
                  }
                >
                  <CustomInput
                    label={nameLabel}
                    value={item.name}
                    onChange={(e) => onChange(index, "name", e.value)}
                    hasError={!!errors[`${prefix}_${index}_name`]}
                    required={false}
                  />

                  <p
                    className={`text-primary text-sm min-h-[20px] ${
                      errors[`${prefix}_${index}_name`]
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    {errors[`${prefix}_${index}_name`] || "\u00A0"}
                  </p>
                </div>

                {/* Price */}
                <div
                  className={
                    showDefaultCheckbox ? "md:col-span-4" : "md:col-span-5"
                  }
                >
                  <CustomInput
                    label="Price"
                    value={item.price}
                    onChange={(e) => onChange(index, "price", e.value)}
                    hasError={!!errors[`${prefix}_${index}_price`]}
                    required={false}
                    currencySymbol="$"
                    onlyPositiveNumber
                    maxLength={7}
                  />

                  <p
                    className={`text-primary text-sm min-h-[20px] ${
                      errors[`${prefix}_${index}_price`]
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    {errors[`${prefix}_${index}_price`] || "\u00A0"}
                  </p>
                </div>

                {/* Remove Button */}
                <div className="md:col-span-2 flex justify-end">
                  <CustomButton
                    variant="line"
                    label="Remove"
                    className="text-danger border-danger !px-4 !py-2"
                    onClick={() => onRemove(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
