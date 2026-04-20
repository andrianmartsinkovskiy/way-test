import {SelectDefault} from "./components/select-default";
import {useEffect, useRef, useState} from "react";

const SERVICE_OPTIONS = [
  {label: "info", value: "info"},
  {label: "atm", value: "atm"},
  {label: "lounge", value: "lounge"},
  {label: "storage", value: "storage"},
]

const LOCATION_OPTIONS = [
  {label: "Adidas", value: "Adidas"},
  {label: "Puma", value: "Puma"},
  {label: "Nike", value: "Nike"},
]

interface IOption {
  label: string
  value: string
}

const LOC = [
  {id: 'Adidas', image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', isEncor: true, name: 'Adidas'},
  {id: 'Nike', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', isEncor: false, name: 'Nike'},
  {id: 'Puma', image: 'https://cdn.brandfetch.io/idDV9AjI6R/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B', isEncor: false, name: 'Puma'},
]

interface IIntegratedLocation {
  id: string;
  name: string
  image: string
  isEncor: boolean
}

interface IIntegratedSetup {
  projectId: number;
  kioskId: number;
  locationId: string | null;
  allLocations: IIntegratedLocation[]
  service: string | null
  isAccessible: boolean
}


function App() {
  const [selectedService, setSelectedService] = useState<IOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<IOption | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  const [mapSetup] = useState<IIntegratedSetup>({
    projectId: 2,
    allLocations: LOC,
    kioskId: 0,
    service: null,
    locationId: null,
    isAccessible: false,
  });

  useEffect(() => {
    if (!isReady) return;
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        type: "MAP_SETUP",
        payload: {
          ...mapSetup,
          service: selectedService?.value ?? null,
          locationId: selectedLocation?.value ?? null,
        },
      },
      "http://localhost:5174"
    );

  }, [isReady, selectedService, selectedLocation]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === "IFRAME_READY") {
        console.log("iframe ready");
        setIsReady(true);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return (
    <div>
      <div className="choose">
        <SelectDefault
          value={selectedService}
          onChange={(v) => setSelectedService(v)}
          options={SERVICE_OPTIONS}
          labelKey="label"
        />

        <SelectDefault
          value={selectedLocation}
          onChange={(v) => setSelectedLocation(v)}
          options={LOCATION_OPTIONS}
          labelKey="label"
        />
      </div>

      <div className="map">
        <iframe
          ref={iframeRef}
          src="http://localhost:5174"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  )
}

export default App
