import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scale, Gavel, FileText, Users, AlertTriangle, BookOpen, HelpCircle } from "lucide-react";

export default function SelfRepresentation() {
  const navigate = useNavigate();

  const guides = [
    {
      id: "small-claims",
      title: "Small Claims Court Guide",
      description: "Step-by-step guide for filing and winning small claims cases",
      difficulty: "Beginner",
      prompt: "I need a complete guide for representing myself in small claims court. Please provide step-by-step instructions on: 1) Filing the claim, 2) Serving the defendant, 3) Preparing evidence, 4) Court appearance tips, 5) Presenting my case, 6) What to expect, 7) Common mistakes to avoid, 8) Collecting the judgment if I win.",
    },
    {
      id: "family-court",
      title: "Family Court Procedures",
      description: "Navigate divorce, custody, and family law cases",
      difficulty: "Intermediate",
      prompt: "I need comprehensive guidance for representing myself in family court for divorce/custody matters. Please cover: 1) Filing initial petitions, 2) Temporary orders process, 3) Discovery and financial disclosures, 4) Mediation process, 5) Trial preparation, 6) Custody evaluations, 7) Child support calculations, 8) Property division, 9) Court appearances, 10) Final judgment.",
    },
    {
      id: "criminal-court",
      title: "Criminal Court Representation",
      description: "Understand your rights and court procedures in criminal cases",
      difficulty: "Advanced",
      prompt: "I'm representing myself in a criminal case. Please provide detailed guidance on: 1) My constitutional rights, 2) Arraignment procedures, 3) Bail and pretrial release, 4) Discovery process, 5) Plea negotiations, 6) Motion filing, 7) Trial preparation, 8) Jury selection, 9) Cross-examination techniques, 10) Closing arguments, 11) Sentencing considerations. Include warnings about when I should definitely hire a lawyer.",
    },
    {
      id: "civil-litigation",
      title: "Civil Litigation Guide",
      description: "Handle civil lawsuits and legal disputes",
      difficulty: "Intermediate",
      prompt: "Guide me through representing myself in a civil lawsuit. Cover: 1) Filing a complaint or answer, 2) Service of process, 3) Discovery (interrogatories, depositions, document requests), 4) Motion practice, 5) Settlement negotiations, 6) Trial preparation, 7) Evidence rules, 8) Witness examination, 9) Trial procedures.",
    },
    {
      id: "eviction-defense",
      title: "Eviction Defense",
      description: "Defend yourself against eviction in housing court",
      difficulty: "Beginner",
      prompt: "I'm facing eviction and need to represent myself. Please provide: 1) My rights as a tenant, 2) Common defenses to eviction, 3) How to respond to eviction notice, 4) Court procedures for eviction hearings, 5) Evidence to gather, 6) How to negotiate with landlord, 7) Emergency stays and appeals.",
    },
    {
      id: "traffic-court",
      title: "Traffic Court Defense",
      description: "Fight traffic tickets and driving violations",
      difficulty: "Beginner",
      prompt: "Help me fight a traffic ticket in court. Cover: 1) Plea options, 2) Trial by declaration vs in-person, 3) Evidence to gather (photos, diagrams, witness statements), 4) Cross-examining the officer, 5) Common defenses, 6) Court procedures, 7) Reducing fines or points.",
    },
  ];

  const resources = [
    {
      title: "Court Etiquette",
      items: [
        "Address the judge as 'Your Honor'",
        "Stand when the judge enters or speaks to you",
        "Dress professionally (business attire)",
        "Arrive 30 minutes early",
        "Turn off your phone",
        "Speak clearly and respectfully",
      ]
    },
    {
      title: "Document Filing Tips",
      items: [
        "Make copies for yourself, court, and other parties",
        "File before deadlines (never wait until last day)",
        "Keep proof of filing and service",
        "Organize documents with tabs and labels",
        "Follow court formatting rules exactly",
        "Proofread everything multiple times",
      ]
    },
    {
      title: "Trial Day Checklist",
      items: [
        "Bring all evidence organized in binders",
        "Prepare opening and closing statements",
        "Have witness list and questions ready",
        "Bring notepad and pen",
        "Review case law and statutes",
        "Practice your presentation",
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Self-Representation Tools</h1>
              <p className="text-sm text-muted-foreground">Represent yourself in court with confidence</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="p-6 mb-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Right to Self-Representation</h3>
              <p className="text-muted-foreground">
                You have the constitutional right to represent yourself in court. These guides will help you 
                exercise that right effectively. For serious criminal cases or complex litigation, consider 
                consulting with an attorney.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Gavel className="h-12 w-12 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Court Procedures</h3>
            <p className="text-sm text-muted-foreground">Learn proper court etiquette and procedures</p>
          </Card>
          <Card className="p-6 text-center">
            <FileText className="h-12 w-12 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Document Filing</h3>
            <p className="text-sm text-muted-foreground">How to file documents correctly and on time</p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Trial Preparation</h3>
            <p className="text-sm text-muted-foreground">Prepare effectively for your court appearance</p>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Self-Representation Guides</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="p-6 hover:border-accent/50 transition-colors">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{guide.title}</h3>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    guide.difficulty === "Beginner" ? "bg-green-500/10 text-green-500" :
                    guide.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    {guide.difficulty}
                  </span>
                </div>
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4 w-full"
                  onClick={() => {
                    navigate('/chat', { state: { initialMessage: guide.prompt } });
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Guide
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Reference</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-accent" />
                {resource.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {resource.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-8 bg-blue-500/10 border-blue-500/20">
          <h3 className="font-semibold text-foreground mb-3">Need More Help?</h3>
          <p className="text-sm text-blue-200 mb-4">
            Use our AI Legal Advisor to get personalized guidance for your specific situation. 
            Ask questions about your case, get document templates, and receive step-by-step instructions.
          </p>
          <Button 
            onClick={() => navigate('/chat')}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Talk to AI Legal Advisor
          </Button>
        </Card>
      </div>
    </div>
  );
}
