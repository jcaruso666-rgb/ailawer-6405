import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Plus, Briefcase, Calendar, FileText, AlertCircle, Trash2, Eye } from "lucide-react";

interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  caseType: string;
  courtDate: string;
  notes: string[];
  documents: string[];
}

export default function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [showNewCase, setShowNewCase] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const [newCaseType, setNewCaseType] = useState("");
  const [newCourtDate, setNewCourtDate] = useState("");
  const [newNote, setNewNote] = useState("");

  const caseTypes = [
    "Civil Litigation",
    "Small Claims",
    "Family Law",
    "Criminal",
    "Traffic",
    "Landlord-Tenant",
    "Personal Injury",
    "Contract Dispute",
    "Employment",
    "Other"
  ];

  const createCase = () => {
    if (!newCaseTitle.trim() || !newCaseType) return;

    const newCase: Case = {
      id: Date.now().toString(),
      title: newCaseTitle,
      description: newCaseDescription,
      status: "active",
      caseType: newCaseType,
      courtDate: newCourtDate,
      notes: [],
      documents: [],
    };

    setCases([...cases, newCase]);
    setNewCaseTitle("");
    setNewCaseDescription("");
    setNewCaseType("");
    setNewCourtDate("");
    setShowNewCase(false);
  };

  const addNote = (caseId: string) => {
    if (!newNote.trim()) return;

    setCases(cases.map(c => 
      c.id === caseId 
        ? { ...c, notes: [...c.notes, `${new Date().toLocaleString()}: ${newNote}`] }
        : c
    ));
    setNewNote("");
  };

  const deleteCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Case Management</h1>
              <p className="text-sm text-muted-foreground">Organize and track your legal cases</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Cases ({cases.length})</h2>
          
          <Dialog open={showNewCase} onOpenChange={setShowNewCase}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Case</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Case Title *</label>
                  <Input
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                    placeholder="e.g., Smith v. Jones"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Case Type *</label>
                  <Select value={newCaseType} onValueChange={setNewCaseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={newCaseDescription}
                    onChange={(e) => setNewCaseDescription(e.target.value)}
                    placeholder="Brief description of the case..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Court Date</label>
                  <Input
                    type="date"
                    value={newCourtDate}
                    onChange={(e) => setNewCourtDate(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={createCase}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={!newCaseTitle.trim() || !newCaseType}
                >
                  Create Case
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {cases.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 text-accent mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Cases Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first case to start organizing your legal matters
            </p>
            <Button 
              onClick={() => setShowNewCase(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Case
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {cases.map((case_) => (
              <Card key={case_.id} className="p-6 hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-accent/10 rounded">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">{case_.title}</h3>
                      <p className="text-muted-foreground">{case_.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    case_.status === "active" ? "bg-green-500/10 text-green-500" : 
                    case_.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-gray-500/10 text-gray-500"
                  }`}>
                    {case_.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-card/50 rounded">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Type: {case_.caseType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {case_.courtDate ? new Date(case_.courtDate).toLocaleDateString() : "No date set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{case_.notes.length} Notes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{case_.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-muted-foreground">{case_.description || "No description"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Case Notes ({case_.notes.length})</h4>
                          {case_.notes.length > 0 ? (
                            <div className="space-y-2">
                              {case_.notes.map((note, idx) => (
                                <div key={idx} className="p-3 bg-card rounded text-sm">
                                  {note}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No notes yet</p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Note to {case_.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your case note..."
                          rows={4}
                        />
                        <Button 
                          onClick={() => {
                            addNote(case_.id);
                            setNewNote("");
                          }}
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                          disabled={!newNote.trim()}
                        >
                          Save Note
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate('/chat', { state: { initialMessage: `I need help with my case: ${case_.title}. ${case_.description}. What should I do next?` }})}
                  >
                    Get AI Advice
                  </Button>

                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteCase(case_.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
