import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Users, Search, Loader2, ExternalLink, AlertCircle } from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function InmateSearch() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [inmateName, setInmateName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state) return;

    setIsSearching(true);
    setResults("");

    try {
      const searchQuery = `Find inmate information for ${state}${county ? `, ${county} County` : ""}${inmateName ? ` - Inmate Name: ${inmateName}` : ""}`;
      
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `I need to search for inmate information in ${state}${county ? `, ${county} County` : ""}${inmateName ? ` for inmate: ${inmateName}` : ""}.

Please provide:

1. **Official State DOC Website**: Direct link to ${state} Department of Corrections inmate search
2. **County Jail Roster**: If ${county} County was specified, provide the county jail website/roster
3. **Federal Bureau of Prisons**: Link to federal inmate locator if applicable
4. **Search Instructions**: Step-by-step guide on how to search for inmates
5. **Alternative Resources**: Other public databases or resources for finding inmate information
6. **What Information You Can Find**: Booking date, charges, bond amount, release date, mugshots, etc.
7. **Visitation and Contact Info**: How to contact or visit inmates

Format the response with clear sections and include actual clickable URLs where possible. Be comprehensive and practical.`
          }],
          model: "gpt-5-nano"
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "text-delta" && data.delta) {
                  fullText += data.delta;
                  setResults(fullText);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults("Error performing search. Please try again.");
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Inmate Search & Locator</h1>
              <p className="text-sm text-muted-foreground">Find inmates in state prisons, county jails, and federal facilities</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">State *</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state..." />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">County (Optional)</label>
              <Input
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g., Los Angeles, Cook, Miami-Dade..."
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave blank for state-level search only</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Inmate Name (Optional)</label>
              <Input
                value={inmateName}
                onChange={(e) => setInmateName(e.target.value)}
                placeholder="First and last name..."
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">Include if searching for specific person</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSearching || !state}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching Inmate Records...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Inmate Records
                </>
              )}
            </Button>
          </form>
        </Card>

        {results && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Search Results & Resources
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {results}
              </div>
            </div>
          </Card>
        )}

        {!results && !isSearching && (
          <Card className="p-8 text-center">
            <Users className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Search Inmate Records</h3>
            <p className="text-muted-foreground mb-4">
              Find inmates in state prisons, county jails, and federal facilities across the United States.
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>This search provides:</strong></p>
              <ul className="text-left max-w-md mx-auto space-y-1">
                <li>• Direct links to state DOC inmate search portals</li>
                <li>• County jail roster websites</li>
                <li>• Federal Bureau of Prisons locator</li>
                <li>• Booking information and charges</li>
                <li>• Release dates and bond information</li>
                <li>• Visitation and contact details</li>
              </ul>
            </div>
          </Card>
        )}

        <Card className="p-6 mb-6 bg-accent/5 border-accent/20">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Access - Federal & National Resources:</h3>
          <div className="space-y-3 text-sm">
            <a 
              href="https://www.bop.gov/inmateloc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Federal Bureau of Prisons - Inmate Locator
            </a>
            <a 
              href="https://www.ice.gov/detain/ice-detainee-locator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              ICE Detainee Locator
            </a>
            <a 
              href="https://www.inmatesearchusa.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Inmate Search USA (Multi-State)
            </a>
            <a 
              href="https://www.vinelink.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              VINELink - Victim Notification
            </a>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Information Notice:</p>
              <p>
                Inmate records are public information. This tool provides guidance on accessing official 
                government databases. Information accuracy depends on the facility's update frequency. 
                Always verify information with the facility directly for legal proceedings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
