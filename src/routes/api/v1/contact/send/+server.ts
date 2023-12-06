/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */

import sanitizeHtml from 'sanitize-html';
import { raise } from '@sxxov/ut/functional';
import { IllegalStateError } from '@sxxov/ut/errors';

const mailjetApiKey =
	process.env['MAILJET_API_KEY'] ??
	raise(
		new IllegalStateError(
			'MAILJET_API_KEY could not be found in environment variables',
		),
	);
const mailjetApiSecret =
	process.env['MAILJET_API_SECRET'] ??
	raise(
		new IllegalStateError(
			'MAILJET_API_SECRET could not be found in environment variables',
		),
	);
const mailjetSenderEmail =
	process.env['MAILJET_SENDER_EMAIL'] ??
	raise(
		new IllegalStateError(
			'MAILJET_SENDER_EMAIL could not be found in environment variables',
		),
	);

const strip = (html: string) =>
	sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
const sanitise = (html: string) => sanitizeHtml(html, {});

export const POST = async ({ request }) => {
	const {
		email,
		name,
		subject,
		message,
	}: {
		email: string;
		name: string;
		subject: string;
		message: string;
	} = await request.json();

	if (!email || !name || !subject || !message)
		return new Response(
			JSON.stringify({
				ok: false,
			}),
		);

	await fetch('https://api.mailjet.com/v3.1/send', {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: `Basic ${btoa(
				`${mailjetApiKey}:${mailjetApiSecret}`,
			)}`,
		},
		body: JSON.stringify({
			Messages: [
				{
					From: {
						Email: mailjetSenderEmail,
						Name: 'ljs bot®',
					},
					To: [
						{
							Email: mailjetSenderEmail,
							Name: 'Lim Jia Sheng',
						},
						{
							Email: email,
							Name: name,
						},
					],
					Subject: subject,
					HTMLPart: `Salutations!<br><br>${sanitise(
						message,
					)}<br><br>— ${strip(name)}<br>${strip(
						email,
					)}<br><br><hr><br><br>Beep boop, this message was sent by ljs bot®. Reply to continue the conversation.`,
				},
			],
		}),
	});

	return new Response(
		JSON.stringify({
			ok: true,
		}),
	);
};
