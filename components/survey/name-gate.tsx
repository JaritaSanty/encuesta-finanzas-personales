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
      setError("Ingresa tu nombre completo para continuar.");
      return;
    }
    const clean = name.trim();
    setLocalStorage(STORAGE_KEYS.fullName, clean);
    onValidName(clean);
    setError("");
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl"><UserRound className="h-6 w-6 text-primary" />Identificación del participante</CardTitle>
        <CardDescription>Antes de iniciar, necesitamos tu nombre para personalizar el reporte final.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={submit}>
          <label htmlFor="fullName" className="text-sm font-medium">Nombre completo</label>
          <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ana María López" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Guardar y continuar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
