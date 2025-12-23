import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Scale, Download, Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Documents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("contract");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState("");

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const documentTypes = [
    { value: "contract", label: "Contract / Agreement" },
    { value: "affidavit", label: "Affidavit" },
    { value: "demand-letter", label: "Demand Letter" },
    { value: "motion", label: "Court Motion" },
    { value: "pleading", label: "Pleading" },
    { value: "brief", label: "Legal Brief" },
    { value: "nda", label: "Non-Disclosure Agreement" },
    { value: "power-of-attorney", label: "Power of Attorney" },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    setIsGenerating(true);
    
    try {
      const docType = documentTypes.find(t => t.value === documentType)?.label || 'Document';
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Draft a professional ${docType} with the following details:

Title: ${title}

Details: ${details}

Please provide a complete, legally-formatted ${docType} that is ready to use. Include all standard clauses, proper legal language, signature blocks, and formatting. Make it comprehensive and professional.`
          }],
          model: 'gpt-5-nano'
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'text-delta' && data.delta) {
                  fullText += data.delta;
                  setGeneratedDocument(fullText);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating document:', error);
      setGeneratedDocument('Error generating document. Please try again.');
    }
    
    setIsGenerating(false);
  };

  const downloadDocument = () => {
    const blob = new Blob([generatedDocument], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Document Drafting</h1>
              <p className="text-sm text-muted-foreground">Generate court-ready legal documents</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-accent" />
                Create New Document
              </h2>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Document Type</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Document Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Service Agreement between ABC Corp and XYZ Ltd"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Details & Requirements</label>
                  <Textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe the key terms, parties involved, obligations, and any specific clauses needed..."
                    rows={8}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!title.trim() || !details.trim() || isGenerating}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Document...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Preview</h2>
                {generatedDocument && (
                  <Button size="sm" onClick={downloadDocument} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
              <div className="h-[600px] overflow-y-auto border border-border rounded p-4 bg-background">
                {generatedDocument ? (
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                    {generatedDocument}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your generated document will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
