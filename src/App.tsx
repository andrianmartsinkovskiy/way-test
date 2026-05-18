import {SelectDefault} from "./components/select-default";
import {useEffect, useRef, useState} from "react";

const SERVICE_OPTIONS = [
  {label: "Baby lounge", value: "babylounge"},
  {label: "wc", value: "wc"},
  {label: "gift", value: "gift"},
  {label: "Handicap WC", value: "handicapwc"},
]

const LOCATION_OPTIONS = [
  {label: "A4", value: "A4"},
  {label: "233b", value: "233b"},
]

const KIOSK_OPTIONS = [
  {label: "1", value: "1"},
  {label: "2", value: "2"},
  {label: "3", value: "3"},
  {label: "4", value: "4"},
]


interface IOption {
  label: string
  value: string
}



interface IIntegratedLocation {
  id: string;
  name: string
  image: string
  isEncor: boolean
}

interface IIntegratedSetup {
  projectId: string;
  kioskId: number;
  locationId: string | null;
  allLocations: IIntegratedLocation[]
  service: string | null
  isAccessible: boolean
}


function App() {
  const [selectedService, setSelectedService] = useState<IOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<IOption | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<IOption>(KIOSK_OPTIONS[0]);
  const [isAccessible, setIsAccessible] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  const [mapSetup] = useState<IIntegratedSetup>({
    kioskId: 1,
    projectId: 'kringlan',
    isAccessible: false,
    locationId: null,
    service: null,
    allLocations: [
      {image: 'test', name: "A4", isEncor: false, id: 'A4'},
      {image: 'test', name: "223b", isEncor: true, id: '233b'},
    ]
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
          isAccessible: isAccessible,
          kioskId: Number(selectedKiosk.value)
        },
      },
      "http://31.131.18.96:3091/"
    );

  }, [isAccessible, selectedService, selectedLocation, isReady, selectedKiosk]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === "IFRAME_READY") {
        setIsReady(true);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  console.log(isReady, 'isReady')

  const classVal = !isReady ? `simple` : 'active'

  return (
    <div>
      <div className={`choose ${classVal}`}>
        <div>
          <h2 className="title">Kiosk</h2>
          <SelectDefault
            value={selectedKiosk}
            onChange={(v) => {setSelectedKiosk(v!)}}
            options={KIOSK_OPTIONS}
            labelKey="label"
            placeholder="Select Kiosk"
            isClearable={false}
          />
        </div>

        <div>
          <h2 className="title">Services</h2>
          <SelectDefault
            value={selectedService}
            onChange={(v) => {
              setSelectedLocation(null)
              setSelectedService(v)
            }}
            options={SERVICE_OPTIONS}
            labelKey="label"
            placeholder="Select Service"
          />
        </div>

        <div>
          <h2 className="title">Shops</h2>
          <SelectDefault
            value={selectedLocation}
            onChange={(v) => {
              setSelectedService(null)
              setSelectedLocation(v)
            }}
            options={LOCATION_OPTIONS}
            labelKey="label"
            placeholder="Select Shop"
          />
        </div>

        <div>
          <h2 className="title">Is Accessible</h2>
          <div className="stairs">
            <div style={{background: isAccessible ? "#444" : "transparent"}} onClick={() => setIsAccessible(true)}>Yes</div>
            <div style={{background: !isAccessible ? "#444" : "transparent"}} onClick={() => setIsAccessible(false)}>No</div>
          </div>
        </div>
      </div>

      <div className="map">
        <iframe
          ref={iframeRef}
          src="http://31.131.18.96:3091/"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  )
}

export default App
