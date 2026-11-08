"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";
import { StarInput } from "@/components/ui/Misc";

export function ReviewModal({ open, onClose, creatorName, onSubmit }: { open: boolean; onClose: () => void; creatorName: string; onSubmit: (rating: number, text: string) => void }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = () => {
    const e: Record<string, string> = {};
    if (!rating) e.rating = "Choose a rating";
    if (text.trim().length < 15) e.text = "Write at least 15 characters";
    setErr(e);
    if (!Object.keys(e).length) { onSubmit(rating, text.trim()); setRating(0); setText(""); }
  };
  return (
    <Modal open={open} onClose={onClose} title={`Rate your session with ${creatorName}`} description="Your review is shown on the creator's public profile." footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit}>Publish review</Button></>}>
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink">Overall rating <span className="text-red-500">*</span></p>
          <StarInput value={rating} onChange={setRating} />
          {err.rating && <p className="mt-1 text-xs font-medium text-red-600">{err.rating}</p>}
        </div>
        <Field label="Your review" required htmlFor="rv" error={err.text}>
          <Textarea id="rv" value={text} onChange={(e) => setText(e.target.value)} invalid={!!err.text} placeholder="What was most useful? Would you recommend this creator?" maxLength={500} />
        </Field>
      </div>
    </Modal>
  );
}
