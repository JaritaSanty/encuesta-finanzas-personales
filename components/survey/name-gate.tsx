"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalStorage, setLocalStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";

export function NameGate({ onValidName }: { onValidName: (name: string) => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = getLocalStorage<string>(STORAGE_KEYS.fullName, "");
    if (saved) {
      setName(saved);
      onValidName(saved);
    }
  }, [onValidName]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Escribe un nombre o apodo para continuar.");
      return;
    }
    const clean = name.trim();
    setLocalStorage(STORAGE_KEYS.fullName, clean);
    onValidName(clean);
    setError("");
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-none rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl"><UserRound className="h-6 w-6 text-primary" />¿Cómo te gustaría que te llamemos?</CardTitle>
        <CardDescription>Usaremos este nombre en tu reporte. Puedes escribir un apodo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={submit}>
          <label htmlFor="fullName" className="text-sm font-medium">Nombre o apodo</label>
          <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ana" maxLength={80} autoComplete="given-name" aria-describedby="name-help" />
          <p id="name-help" className="text-sm text-muted-foreground">Se guarda en este navegador junto con tus respuestas. Evita usar datos personales en un equipo compartido.</p>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Comenzar preguntas</Button>
        </form>
      </CardContent>
    </Card>
  );
}
