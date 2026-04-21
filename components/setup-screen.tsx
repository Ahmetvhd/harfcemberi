'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { GameRecord } from '@/hooks/use-records';

interface SetupScreenProps {
  onStartGame: (name: string, duration: number) => void;
  records: GameRecord[];
  onUpdateRecord: (id: string, name: string, score: number) => void;
  onDeleteRecord: (id: string) => void;
}

export function SetupScreen({ onStartGame, records, onUpdateRecord, onDeleteRecord }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('120');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && duration) {
      onStartGame(name.trim(), parseInt(duration, 10));
    }
  };

  const isValid = name.trim().length > 0 && parseInt(duration, 10) > 0;

  const startEdit = (record: GameRecord) => {
    setEditingId(record.id);
    setEditName(record.contestantName);
    setEditScore(record.score.toString());
    setDeleteConfirmId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditScore('');
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      const scoreNum = parseInt(editScore, 10);
      onUpdateRecord(editingId, editName.trim(), isNaN(scoreNum) ? 0 : scoreNum);
      cancelEdit();
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDeleteRecord(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-6">
        {/* Game Setup Card */}
        <Card className="flex-1 border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
              Harf Çemberi
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Türkçe Harf Bilgi Yarışması
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Adınızı girin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">
                  Süre (saniye)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="30"
                  max="600"
                  placeholder="120"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Önerilen: 90-180 saniye
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!isValid}
              >
                Oyunu Başlat
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Records Panel */}
        <Card className="flex-1 border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Kayıtlar
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {records.length === 0 ? 'Henüz kayıt yok' : `${records.length} kayıt`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 group"
                >
                  {editingId === record.id ? (
                    <>
                      <div className="flex-1 flex gap-2">
                        <Input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-sm bg-input border-border"
                          placeholder="Ad Soyad"
                        />
                        <Input
                          type="number"
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          className="h-8 w-20 text-sm bg-input border-border"
                          placeholder="Puan"
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={saveEdit}
                        className="h-7 w-7 text-correct hover:text-correct hover:bg-correct/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {record.contestantName}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {record.score}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(record)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          className={`h-7 w-7 ${
                            deleteConfirmId === record.id
                              ? 'text-wrong bg-wrong/10'
                              : 'text-muted-foreground hover:text-wrong hover:bg-wrong/10'
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
