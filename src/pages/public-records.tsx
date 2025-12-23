import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, FileSearch, ExternalLink, Gavel, Home, Building, AlertCircle, MapPin } from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// State-specific public records portals
const STATE_RECORDS = {
  "Alabama": {
    court: "https://www.alacourt.gov/",
    property: "https://www.alabamaadministrativecode.state.al.us/",
    business: "https://www.sos.alabama.gov/business-entities",
    criminal: "https://www.alea.gov/",
  },
  "California": {
    court: "https://www.courts.ca.gov/",
    property: "https://www.boe.ca.gov/",
    business: "https://bizfileonline.sos.ca.gov/",
    criminal: "https://oag.ca.gov/fingerprints/security",
  },
  "Florida": {
    court: "https://www.flcourts.org/",
    property: "https://www.myflorida.com/",
    business: "https://dos.myflorida.com/sunbiz/",
    criminal: "https://www.fdle.state.fl.us/",
  },
  "Texas": {
    court: "https://www.txcourts.gov/",
    property: "https://comptroller.texas.gov/",
    business: "https://www.sos.state.tx.us/corp/",
    criminal: "https://records.txdps.state.tx.us/",
  },
  "New York": {
    court: "https://ww2.nycourts.gov/",
    property: "https://www.tax.ny.gov/",
    business: "https://www.dos.ny.gov/corps/",
    criminal: "https://www.criminaljustice.ny.gov/",
  },
};

export default function PublicRecords() {
  const navigate = useNavigate();
  const [state, setState] = useState("");

  const selectedStateRecords = state ? (STATE_RECORDS as any)[state] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Public Records - Direct Access</h1>
              <p className="text-sm text-muted-foreground">Direct links to official government databases</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        
        {/* State Selector */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Select State</label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a state to see public records links..." />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* National/Federal Resources - Always Visible */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-accent" />
            Federal & National Public Records
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <Gavel className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Federal Court Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://pacer.uscourts.gov/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  PACER - Federal Court Records
                </a>
                <a href="https://www.courtlistener.com/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  CourtListener - Free PACER Alternative
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <Home className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Property Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://publicrecords.netronline.com/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Property & Deed Search (All States)
                </a>
                <a href="https://www.zillow.com/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Zillow Property Records
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <Building className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Business Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.sec.gov/edgar/searchedgar/companysearch.html" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  SEC EDGAR (Public Companies)
                </a>
                <a href="https://opencorporates.com/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  OpenCorporates (Global Business Database)
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <AlertCircle className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Criminal & Background</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  National Sex Offender Registry
                </a>
                <a href="https://www.fbi.gov/wanted" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  FBI Most Wanted
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* State-Specific Resources */}
        {selectedStateRecords && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-accent" />
              {state} Public Records
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {selectedStateRecords.court && (
                <Card className="p-4">
                  <Gavel className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Court Records</h3>
                  <a href={selectedStateRecords.court} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-accent hover:underline text-sm">
                    <ExternalLink className="h-4 w-4" />
                    {state} Courts Website
                  </a>
                </Card>
              )}

              {selectedStateRecords.property && (
                <Card className="p-4">
                  <Home className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Property Records</h3>
                  <a href={selectedStateRecords.property} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-accent hover:underline text-sm">
                    <ExternalLink className="h-4 w-4" />
                    {state} Property Database
                  </a>
                </Card>
              )}

              {selectedStateRecords.business && (
                <Card className="p-4">
                  <Building className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Business Records</h3>
                  <a href={selectedStateRecords.business} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-accent hover:underline text-sm">
                    <ExternalLink className="h-4 w-4" />
                    {state} Secretary of State
                  </a>
                </Card>
              )}

              {selectedStateRecords.criminal && (
                <Card className="p-4">
                  <AlertCircle className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Criminal Records</h3>
                  <a href={selectedStateRecords.criminal} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-accent hover:underline text-sm">
                    <ExternalLink className="h-4 w-4" />
                    {state} Law Enforcement
                  </a>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* All States Public Records Aggregators */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Multi-State Record Searches</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Court Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.judyrecords.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  JudyRecords (Multi-State)
                </a>
                <a href="https://unicourt.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  UniCourt
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Property & Deeds</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.realtor.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Realtor.com
                </a>
                <a href="https://www.zillow.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Zillow
                </a>
                <a href="https://publicrecords.netronline.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Netronline Public Records
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Business Filings</h3>
              <div className="space-y-2 text-sm">
                <a href="https://opencorporates.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  OpenCorporates
                </a>
                <a href="https://www.sec.gov/edgar/searchedgar/companysearch.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  SEC EDGAR
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Criminal Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Sex Offender Registry
                </a>
                <a href="https://www.fbi.gov/wanted" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  FBI Most Wanted
                </a>
                <a href="https://www.bop.gov/inmateloc/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Federal Inmate Locator
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Vital Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.cdc.gov/nchs/w2w.htm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  CDC - Birth/Death Records
                </a>
                <a href="https://www.usa.gov/replace-vital-documents" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  USA.gov Vital Records
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">General Public Records</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.usa.gov/public-records" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  USA.gov Public Records Portal
                </a>
                <a href="https://www.brbpublications.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  BRB Publications Directory
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* More State Links */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">State-Specific Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {US_STATES.map((stateName) => (
              <Card 
                key={stateName}
                className="p-3 hover:border-accent/50 cursor-pointer transition-all"
                onClick={() => setState(stateName)}
              >
                <p className="text-sm font-medium text-foreground">{stateName}</p>
                <p className="text-xs text-muted-foreground">Click to view official portals</p>
              </Card>
            ))}
          </div>
        </div>

        {/* County Resources by Popular Counties */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Popular County Clerk Offices</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">California Counties</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.lacourt.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Los Angeles County Superior Court
                </a>
                <a href="https://www.sdcourt.ca.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  San Diego County Court
                </a>
                <a href="https://www.occourts.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Orange County Court
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Texas Counties</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.justex.net/courts/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Harris County (Houston) Courts
                </a>
                <a href="https://www.dallascounty.org/government/courts/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Dallas County Courts
                </a>
                <a href="https://www.traviscountytx.gov/district-clerk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Travis County (Austin) Records
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Florida Counties</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.miami-dadeclerk.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Miami-Dade County Clerk
                </a>
                <a href="https://www.pinellasclerk.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  Pinellas County Clerk
                </a>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">New York</h3>
              <div className="space-y-2 text-sm">
                <a href="https://iapps.courts.state.ny.us/webcivil/FCASMain" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  NY Courts WebCivil
                </a>
                <a href="https://a836-acris.nyc.gov/CP/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  NYC Property Records (ACRIS)
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Free Search Tools */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Public Records Search Tools</h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-3">People Search</h3>
                <div className="space-y-2 text-sm">
                  <a href="https://www.whitepages.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    Whitepages
                  </a>
                  <a href="https://www.truepeoplesearch.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    True People Search (Free)
                  </a>
                  <a href="https://www.fastpeoplesearch.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    Fast People Search (Free)
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Phone & Address</h3>
                <div className="space-y-2 text-sm">
                  <a href="https://www.411.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    411.com
                  </a>
                  <a href="https://www.anywho.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    AnyWho
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-200">
            <strong>Direct Access:</strong> All links above go directly to official government websites and public databases. 
            No signup or payment needed for most searches. Some records may require a small fee for certified copies. 
            All information accessed through these links is legally public.
          </p>
        </div>
      </div>
    </div>
  );
}
