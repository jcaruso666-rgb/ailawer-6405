import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Scale, UserSearch, Search, Building, MapPin, FileSearch, Loader2, ExternalLink } from "lucide-react";

export default function OSINT() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("people");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState("");

  const searchTypes = [
    { value: "people", label: "People Search", icon: UserSearch },
    { value: "property", label: "Property Records", icon: MapPin },
    { value: "business", label: "Business Entities", icon: Building },
    { value: "court", label: "Court Records", icon: FileSearch },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults("");

    try {
      const searchTypeLabel = searchTypes.find(t => t.value === searchType)?.label || "information";
      
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Perform an OSINT (Open Source Intelligence) search for ${searchTypeLabel}.

Search Query: ${query}

Please provide:
1. Where to search for this information (specific websites, databases, public records)
2. Step-by-step instructions on how to find this information
3. What types of public records are available
4. Legal ways to access this information
5. Important considerations and privacy laws
6. Specific search operators or techniques to use

Be thorough and provide actionable guidance on conducting legal OSINT research.`
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
              <h1 className="text-xl font-bold text-foreground">OSINT & Background Investigation</h1>
              <p className="text-sm text-muted-foreground">Legal public records research and investigation guidance</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {searchTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.value}
                className={`p-4 cursor-pointer transition-all ${
                  searchType === type.value ? "border-accent bg-accent/5" : "hover:border-accent/50"
                }`}
                onClick={() => setSearchType(type.value)}
              >
                <Icon className="h-8 w-8 text-accent mb-2" />
                <h3 className="font-semibold text-foreground">{type.label}</h3>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Search Query</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter name, address, business name, or case number..."
                className="text-base"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Public Records
                </>
              )}
            </Button>
          </form>
        </Card>

        {results && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-accent" />
              Search Results & Guidance
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
            <UserSearch className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Start Your Investigation</h3>
            <p className="text-muted-foreground mb-4">
              Enter search details above to get comprehensive guidance on finding public records and conducting legal OSINT research.
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>This tool provides:</strong></p>
              <ul className="text-left max-w-md mx-auto space-y-1">
                <li>• Step-by-step search instructions</li>
                <li>• Links to public databases and records</li>
                <li>• Legal research techniques</li>
                <li>• Privacy law considerations</li>
                <li>• Professional OSINT methods</li>
              </ul>
            </div>
          </Card>
        )}

        <Card className="p-6 mt-6 bg-accent/5 border-accent/20">
          <h3 className="text-sm font-semibold text-foreground mb-3">Popular Public Record Sources:</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <a href="https://www.usa.gov/find-public-records" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 text-accent hover:underline">
              <ExternalLink className="h-4 w-4" />
              USA.gov Public Records
            </a>
            <a href="https://pacer.uscourts.gov" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-accent hover:underline">
              <ExternalLink className="h-4 w-4" />
              PACER Court Records
            </a>
            <a href="https://www.bop.gov/inmateloc" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-accent hover:underline">
              <ExternalLink className="h-4 w-4" />
              Federal Bureau of Prisons
            </a>
            <a href="https://www.nsopw.gov" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-accent hover:underline">
              <ExternalLink className="h-4 w-4" />
              Sex Offender Registry
            </a>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-200">
            <strong>Legal Notice:</strong> This tool provides guidance on accessing public records through legal means. 
            Always respect privacy laws and obtain information only through authorized channels. Unauthorized access 
            to private information is illegal.
          </p>
        </div>
      </div>
    </div>
  );
}
