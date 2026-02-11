import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  type: "sent" | "received";
  content: string;
  timestamp: string;
  status?: string;
  classification?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio" | "document";
}

const classificationStyles: Record<string, string> = {
  INTERESSADO: "bg-accent text-accent-foreground",
  NAO_INTERESSADO: "bg-destructive/10 text-destructive",
  UNCLASSIFIED: "bg-muted text-muted-foreground",
  OPT_OUT: "bg-muted text-muted-foreground",
};

export function MessageBubble({
  type,
  content,
  timestamp,
  status,
  classification,
  mediaUrl,
  mediaType,
}: MessageBubbleProps) {
  const isSent = type === "sent";

  return (
    <div className={cn("flex mb-2 animate-fade-in", isSent ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[65%] rounded-lg shadow-sm relative",
          isSent ? "bg-wa-sent-bubble" : "bg-card"
        )}
      >
        {mediaUrl && mediaType === "image" && (
          <img src={mediaUrl} alt="" className="w-full rounded-t-lg max-w-xs" />
        )}
        {mediaUrl && mediaType === "video" && (
          <video src={mediaUrl} controls className="w-full rounded-t-lg max-w-xs" />
        )}
        {mediaUrl && mediaType === "audio" && (
          <audio src={mediaUrl} controls className="w-full px-3 py-2" />
        )}

        {content && (
          <div className="px-3 py-2">
            <p className="text-sm text-foreground whitespace-pre-wrap break-words">{content}</p>
          </div>
        )}

        <div className="px-3 pb-1.5 flex items-center justify-end gap-1">
          {!isSent && classification && classification !== "UNCLASSIFIED" && (
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded mr-auto",
                classificationStyles[classification] || classificationStyles.UNCLASSIFIED
              )}
            >
              {classification}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {format(new Date(timestamp), "HH:mm")}
          </span>
          {isSent && (
            <span>
              {status === "read" ? (
                <CheckCheck className="w-4 h-4 text-wa-blue" />
              ) : status === "delivered" ? (
                <CheckCheck className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Check className="w-4 h-4 text-muted-foreground" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
