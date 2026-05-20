export function getComponent(components, type) {
  return components?.find((c) => c.types.includes(type))?.long_name || "";
}

export function extractAddressFromComponents(components) {
  const streetNumber = getComponent(components, "street_number");
  const route = getComponent(components, "route");
  const subpremise = getComponent(components, "subpremise");
  const premise = getComponent(components, "premise");
  const pincode = getComponent(components, "postal_code");
  const locality = getComponent(components, "locality");
  const sublocality = getComponent(components, "sublocality_level_1");

  let plotNo = "";
  if (streetNumber) {
    plotNo = route ? `${streetNumber} ${route}` : streetNumber;
  } else if (route) {
    plotNo = route;
  }

  return {
    plot_no: plotNo,
    floor: subpremise || "",
    building_name: premise || sublocality || locality || "",
    pincode,
  };
}

export function buildCompleteAddress(data) {
  return [data.plot_no, data.floor, data.building_name, data.pincode]
    .filter(Boolean)
    .join(", ");
}
