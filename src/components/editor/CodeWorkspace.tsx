"use client";

import { CHALLENGE_LIST, EDITOR_LANGUAGES } from "@/constants/sessionConfig";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, FileText, Sparkles } from "lucide-react";
import Editor from "@monaco-editor/react";

// Coding challenges workspace including code editor panel
export function CodeWorkspace() {
  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGE_LIST[0]);
  const [currentLanguage, setCurrentLanguage] = useState<"javascript" | "python" | "java">(
    EDITOR_LANGUAGES[0].id
  );
  
  const [codeContent, setCodeContent] = useState(
    currentChallenge.templates[currentLanguage]
  );

  const switchChallenge = (challengeId: string) => {
    const found = CHALLENGE_LIST.find((c) => c.id === challengeId);
    if (found) {
      setCurrentChallenge(found);
      setCodeContent(found.templates[currentLanguage]);
    }
  };

  const switchLanguage = (langId: "javascript" | "python" | "java") => {
    setCurrentLanguage(langId);
    setCodeContent(currentChallenge.templates[langId]);
  };

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[calc(100vh-4rem-1px)] bg-background"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
        <ScrollArea className="h-full border-b">
          <div className="p-5 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {currentChallenge.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Read instructions carefully and construct your function below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={currentChallenge.id}
                  onValueChange={switchChallenge}
                >
                  <SelectTrigger className="w-[170px] h-9 text-xs">
                    <SelectValue placeholder="Select challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHALLENGE_LIST.map((prob) => (
                      <SelectItem key={prob.id} value={prob.id} className="text-xs cursor-pointer">
                        {prob.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={currentLanguage} onValueChange={switchLanguage}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <img
                          src={`/${currentLanguage}.png`}
                          alt={currentLanguage}
                          className="w-4 h-4 object-contain"
                        />
                        <span className="capitalize">{currentLanguage}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {EDITOR_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id} className="text-xs cursor-pointer">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${lang.id}.png`}
                            alt={lang.label}
                            className="w-4 h-4 object-contain"
                          />
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="border border-border/80 shadow-2xs">
              <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Problem Statement</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed p-4 prose prose-sm dark:prose-invert">
                <p className="whitespace-pre-line text-foreground/90 font-sans">
                  {currentChallenge.instructions}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/80 shadow-2xs">
              <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">Test Cases</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {currentChallenge.testCases.map((tc, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Example {idx + 1}:
                    </p>
                    <pre className="bg-muted/50 border p-3 rounded-lg text-xs font-mono select-all overflow-x-auto">
                      <div>Input: {tc.input}</div>
                      <div>Output: {tc.output}</div>
                      {tc.explanation && (
                        <div className="pt-2 mt-2 border-t border-dashed text-muted-foreground">
                          Explanation: {tc.explanation}
                        </div>
                      )}
                    </pre>
                  </div>
                ))}
              </CardContent>
            </Card>

            {currentChallenge.limits && (
              <Card className="border border-border/80 shadow-2xs">
                <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm font-semibold">Constraints</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="list-disc list-inside space-y-1 text-xs.5 text-muted-foreground">
                    {currentChallenge.limits.map((rule, idx) => (
                      <li key={idx} className="marker:text-primary">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border/60 hover:bg-primary/50 transition-colors" />

      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full w-full relative">
          <Editor
            height="100%"
            defaultLanguage={currentLanguage}
            language={currentLanguage}
            theme="vs-dark"
            value={codeContent}
            onChange={(val) => setCodeContent(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              wordWrap: "on",
              wrappingIndent: "indent",
              tabSize: 2,
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeWorkspace;
