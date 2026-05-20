import { useState, useEffect, useRef, useCallback } from "react";
import CustomInput from "@/components/forms/CustomInput";
import gps from "@/assets/images/icons/gps.png";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import CustomButton from "@/components/ui/Button/Button";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import SkeletonImage from "@/components/ui/SkeletonImage";

const GOOGLE_MAP_LIBRARIES = ["places"];
const DEFAULT_COORDS = { lat: 28.6139, lng: 77.209 };
const MAP_STYLE = { width: "100%", height: "260px", borderRadius: "10px" };
const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

function getComponent(components, type) {
  return components?.find((c) => c.types.includes(type))?.long_name || "";
}

function extractAddressFromComponents(components) {
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

function buildCompleteAddress(data) {
  return [data.plot_no, data.floor, data.building_name, data.pincode]
    .filter(Boolean)
    .join(", ");
}

function SearchScreen({ onOpenDetails }) {
  return (
    <div className="px-10 py-6 space-y-5">
      <div className="border border-neutral-400 rounded-xl">
        <div
          onClick={onOpenDetails}
          className="flex items-center gap-3 cursor-pointer p-6"
        >
          <SkeletonImage src={gps} className="h-6 w-6" alt="gps" />
          <p className="text-primary font-medium text-[16pxs]">
            Select your restaurant address using GPS
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailsScreen({
  addressData,
  isLoaded,
  autoRef,
  mapRef,
  onFieldChange,
  onPlaceChanged,
  onMapClick,
  onMarkerDragEnd,
  onSave,
}) {
  return (
    <div className="px-10 py-6 space-y-6">
      <div className="border border-neutral-400 rounded-xl p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-black text-[18px] font-medium">Address Details</p>
          <p className="text-neutral-500 text-[15px]">
            Provide accurate details to ensure timely delivery of food to your
            customers
          </p>
        </div>

        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-10 md:col-span-6">
            <CustomInput
              label="Shop/Plot Number"
              onlyPositiveNumber
              name="plot_no"
              maxLength={60}
              onChange={onFieldChange}
              data={addressData}
              required={false}
            />
          </div>

          <div className="col-span-10 md:col-span-4">
            <CustomInput
              label="Floor"
              name="floor"
              onChange={onFieldChange}
              maxLength={15}
              data={addressData}
              required={false}
            />
          </div>

          <div className="col-span-10">
            <CustomInput
              label="Building/Mall/Complex Name"
              name="building_name"
              onChange={onFieldChange}
              maxLength={100}
              data={addressData}
            />
          </div>

          <div className="col-span-10">
            <CustomInput
              label="Pincode"
              name="pincode"
              onChange={onFieldChange}
              data={addressData}
            />
          </div>

          <div className="col-span-10 space-y-2">
            <p className="text-base font-medium text-black">Complete Address</p>
            <p className="text-[15px] text-black wrap-break-word">
              {addressData.complete_address || "Select a location on the map"}
            </p>
          </div>

          <div className="col-span-10 border border-neutral-400 rounded-xl p-3">
            {isLoaded ? (
              <div className="space-y-4">
                <Autocomplete
                  onLoad={(ref) => (autoRef.current = ref)}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    placeholder="Search location"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </Autocomplete>

                <GoogleMap
                  onLoad={(map) => (mapRef.current = map)}
                  center={{ lat: addressData.lat, lng: addressData.lng }}
                  zoom={15}
                  mapContainerStyle={MAP_STYLE}
                  onClick={onMapClick}
                  options={MAP_OPTIONS}
                >
                  <Marker
                    position={{ lat: addressData.lat, lng: addressData.lng }}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                    animation={window.google?.maps?.Animation?.DROP}
                  />
                </GoogleMap>
              </div>
            ) : (
              <p>Loading map…</p>
            )}
          </div>
        </div>

        <CustomButton
          variant="primary"
          label="Save"
          fullWidth={false}
          onClick={onSave}
          className=" lg:px-[75px]"
        />
      </div>
    </div>
  );
}

export default function AddressDialog({
  open,
  onClose,
  onSave,
  addressDetails,
  addressData, 
}) {
  const autoRef = useRef(null);
  const mapRef = useRef(null);
  const [screen, setScreen] = useState("search");
  const [localAddressData, setLocalAddressData] = useState({
    plot_no: "",
    floor: "",
    building_name: "",
    pincode: "",
    complete_address: "",
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const updateMapCenter = useCallback((lat, lng, zoom) => {
    if (!mapRef.current) return;
    mapRef.current.setCenter({ lat, lng });
    if (zoom) mapRef.current.setZoom(zoom);
  }, []);

  const reverseGeocode = useCallback(
    (lat, lng) => {
      if (!window.google || !isLoaded) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !results[0]) return;

        const place = results[0];
        const extracted = extractAddressFromComponents(
          place.address_components || [],
        );

        setLocalAddressData((prev) => {
          const { formErrors: _, ...rest } = prev;
          return {
            ...rest,
            ...extracted,
            floor: extracted.floor || rest.floor,
            building_name: extracted.building_name || rest.building_name,
            pincode: extracted.pincode || rest.pincode,
            complete_address: place.formatted_address,
            lat,
            lng,
          };
        });
      });
    },
    [isLoaded],
  );

  useEffect(() => {
    if (!open) {
      setScreen("search");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (
      localAddressData?.plot_no ||
      localAddressData?.floor ||
      localAddressData?.building_name ||
      localAddressData?.pincode
    ) {
      setScreen("details");
    }
  }, [localAddressData, open]);

  useEffect(() => {
    if (!open) return;

    let initialData = null;

    if (addressData?.complete_address) {
      initialData = { ...addressData };
    }
    else if (addressDetails && Object.keys(addressDetails).length > 0) {
      const { latitude, longitude } = addressDetails?.coordinates || {};
      initialData = {
        plot_no: addressDetails.plot_no || "",
        floor: addressDetails.floor || "",
        building_name: addressDetails.building_name || "",
        pincode: addressDetails.pincode || "",
        complete_address: addressDetails.complete_address || "",
        lat: latitude || DEFAULT_COORDS.lat,
        lng: longitude || DEFAULT_COORDS.lng,
      };
    }

    if (initialData) {
      setLocalAddressData(initialData);
      if (isLoaded) {
        updateMapCenter(initialData.lat, initialData.lng);
      }
    } else {
      setLocalAddressData({
        plot_no: "",
        floor: "",
        building_name: "",
        pincode: "",
        complete_address: "",
        lat: DEFAULT_COORDS.lat,
        lng: DEFAULT_COORDS.lng,
      });
    }
  }, [open, addressDetails, addressData, isLoaded, updateMapCenter]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handlePlaceChanged = () => {
    const place = autoRef.current.getPlace();
    if (!place?.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const extracted = extractAddressFromComponents(
      place.address_components || [],
    );

    setLocalAddressData({
      ...extracted,
      complete_address: place.formatted_address,
      lat,
      lng,
    });
    updateMapCenter(lat, lng, 15);
  };

  const handleMarkerDragEnd = (e) => {
    reverseGeocode(e.latLng.lat(), e.latLng.lng());
  };

  const handleMapClick = (e) => {
    if (e.latLng) reverseGeocode(e.latLng.lat(), e.latLng.lng());
  };

  const handleFieldChange = ({ name, value }) => {
    let nextValue = value;
    if (name === "pincode") {
      nextValue = (value || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
    }

    const updated = { ...localAddressData, [name]: nextValue };

    const formErrors = formValidation(name, nextValue, updated);
    setLocalAddressData({ ...updated, formErrors });
  };

  const handleSaveClick = () => {
    const { formErrors: _, ...cleanData } = localAddressData;
    if (showFormErrors(cleanData, setLocalAddressData)) {
      onSave(cleanData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-30">
      <div className="bg-white w-full 2xl:w-[611px] lg:w-[511px] h-full shadow-2xl rounded-l-2xl animate-slideLeft overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-400 bg-white">
          <h1 className="text-[22px] font-semibold">
            {screen === "search"
              ? "Search restaurant name/locality"
              : "Add Restaurant Location"}
          </h1>
          <button onClick={onClose} className="text-4xl hover:text-gray-600">
            &times;
          </button>
        </div>

        {screen === "search" ? (
          <SearchScreen onOpenDetails={() => setScreen("details")} />
        ) : (
          <DetailsScreen
            addressData={localAddressData}
            isLoaded={isLoaded}
            autoRef={autoRef}
            mapRef={mapRef}
            onFieldChange={handleFieldChange}
            onPlaceChanged={handlePlaceChanged}
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
            onSave={handleSaveClick}
          />
        )}
      </div>
    </div>
  );
}
