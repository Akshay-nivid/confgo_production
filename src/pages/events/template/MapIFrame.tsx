/**
 * MapIFrame component renders the map in an iframe
 */
import { Logger } from "@/Utils/Logger";

export const MapIframe = ({ url }: { url: string }) => {
    const extractCoordinatesFromUrl = (url: string) => {
      try {
        const match = url.match(/@([-0-9.]+),([-0-9.]+)/);
        if (match && match.length >= 3) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          return { lat, lng };
        }
        throw new Error("Coordinates not found in URL");
      } catch (error) {
        Logger.error("Error extracting coordinates:", error);
      }
    };
  
    const coordinates = extractCoordinatesFromUrl(url);
  
    if (!coordinates) {
      return <div>Error: Unable to extract coordinates</div>;
    }
  
    return (
      <iframe
        className="edit-location-container-edit-map"
        src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
        loading="lazy"
        style={{ width: "100%", height: "400px", border: "0" }}
      />
    );
  };
  