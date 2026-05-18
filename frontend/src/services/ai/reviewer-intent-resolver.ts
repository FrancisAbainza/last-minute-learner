"use server";

import { gateway } from "ai";

const model = gateway("anthropic/claude-sonnet-4");

export async function executeIntent(prompt: string) {
  /* 
  Create:
  Generate reviewer based on prompt 
  Save reviewer to database
  */

  /* 
  Read
  Fetch all user reviewer 
  Determine the reviewer id based on the prompt 
  Redirect to the appropriate page 
  Delete reviewer from database
  */

  /* 
  Delete
  Fetch all user reviewer 
  Determine the reviewer id based on prompt and all avaliable user reviewers
  Delete reviewer from database
  */
}

