import { NextResponse } from "next/server";

type ContactRequestBody = {
  fullName?: string;
  email?: string;
  company?: string;
  teamSize?: string;
  role?: string;
  updates?: boolean;
};

const CMS_CONTACTS_ENDPOINT = "https://cms.flowautomate.io/api/contacts";

export async function POST(request: Request) {
  let body: ContactRequestBody;
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const teamSize = body.teamSize?.trim() ?? "";
  const role = body.role?.trim() ?? "";

  if (!fullName || !email || !company || !role) {
    return NextResponse.json(
      { error: "Missing required contact fields" },
      { status: 400 },
    );
  }

  const messageLines = [
    `Company: ${company}`,
    teamSize ? `Team size: ${teamSize}` : "",
    `Role: ${role}`,
    `Marketing updates opt-in: ${body.updates ? "Yes" : "No"}`,
  ].filter(Boolean);

  const cmsPayload = {
    data: {
      Full_Name: fullName,
      Email: email,
      Message: messageLines.join("\n"),
    },
  };

  try {
    const cmsResponse = await fetch(CMS_CONTACTS_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Origin: "https://flowautomate.com",
        Referer: "https://flowautomate.com/",
      },
      body: JSON.stringify(cmsPayload),
      cache: "no-store",
    });

    if (!cmsResponse.ok) {
      const cmsError = await cmsResponse.text();
      return NextResponse.json(
        {
          error: "Failed to send contact request to CMS",
          status: cmsResponse.status,
          details: cmsError.slice(0, 400),
        },
        { status: 502 },
      );
    }

    const cmsData = await cmsResponse.json().catch(() => null);
    return NextResponse.json({ ok: true, data: cmsData?.data ?? null });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach contact CMS endpoint" },
      { status: 502 },
    );
  }
}
