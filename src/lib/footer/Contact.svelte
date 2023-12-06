<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Dropdown, Hint, Input } from '@sxxov/sv/input';
	import { Spacer } from '@sxxov/sv/layout';
	import { Svg } from '@sxxov/sv/svg';
	import {
		ic_arrow_outward,
		ic_attach_email,
		ic_category,
		ic_done,
		ic_email,
		ic_emoji_objects,
		ic_face,
		ic_groups,
		ic_message,
		ic_question_mark,
	} from 'maic/two_tone';
	import { Levels } from '@sxxov/sv/common/enums';
	import { dropIn, dropOut } from '@sxxov/sv/ut/transition/transitions';
	import { toasts } from '@sxxov/sv/toast';
	import Hash from '../nav/Hash.svelte';

	let attempted = false;
	let name = '';
	$: nameEmpty = name.length <= 0;
	let email = '';
	$: emailEmpty = email.length <= 0;
	$: emailInvalid =
		!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
			email,
		);
	let subject = '';
	$: subjectEmpty = subject.length <= 0;
	let topicId = '';
	$: topics = [
		{
			id: 'other',
			title: '…because I want to enquire.',
			icon: ic_question_mark,
			terms: [],
		},
		{
			id: 'collaboration',
			title: '…because I want to collaborate.',
			icon: ic_groups,
			terms: [],
		},
		{
			id: 'feedback',
			title: '…because I want to give feedback.',
			icon: ic_emoji_objects,
			terms: [],
		},
	] as const;
	$: topic = topics.find((topic) => topic.id === topicId);
	let message = '';
	$: messageEmpty = message.length <= 0;

	$: sending = false;
</script>

<div class="call-to-contact">
	<div class="background"></div>
	<div class="heading">
		<h2>
			<span class="sub"
				><span class="icon"
					><Svg
						height="100%"
						width="100%"
						svg={ic_message}
					/></span
				>Contact Me</span
			>
		</h2>
	</div>
	<div class="content">
		<div class="container">
			<form
				on:submit={async (e) => {
					e.preventDefault();
					attempted = true;

					if (
						!nameEmpty &&
						!emailEmpty &&
						!emailInvalid &&
						!subjectEmpty &&
						!messageEmpty
					) {
						sending = true;
						const resp = await fetch('/api/v1/contact/send', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								name,
								email,
								subject: `${subject} ${String(topic?.title)}`,
								message,
							}),
						});

						name = '';
						email = '';
						subject = '';
						topicId = topics[0].id;
						message = '';

						attempted = false;

						if (resp.ok)
							toasts.push({
								text: 'Your message has been sent successfully!',
								level: Levels.OK,
							});
						else
							toasts.push({
								text: 'Your message could not be sent. Please try again later.',
								level: Levels.ERROR,
							});

						sending = false;
					}
				}}
			>
				<h3>Email:</h3>
				<div class="left">
					<a href="mailto:hello@deceitville.com">
						<Button
							{...ButtonVariants.Secondary}
							{...ButtonVariants.Shadow.Sm}
							colourBackground="----colour-text-primary"
							colourBackgroundHover="----colour-background-primary"
							colourText="----colour-background-primary"
							width="100%"
						>
							<svelte:fragment slot="left">
								<Svg svg={ic_attach_email} />
							</svelte:fragment>
							hello@deceitville.com
							<svelte:fragment slot="right">
								<Svg svg={ic_arrow_outward} />
							</svelte:fragment>
						</Button>
					</a>
				</div>
				<div class="separator">
					<div class="line" />
					<p>or</p>
					<div class="line" />
				</div>
				<h3>Message:</h3>
				<div class="right">
					<div class="input name">
						<Input
							width="100%"
							name="name"
							label="Your Name"
							placeholder="John Doe"
							autocomplete="name"
							bind:value={name}
						>
							<svelte:fragment slot="label-left">
								1. <Svg svg={ic_face} />
							</svelte:fragment>
							<svelte:fragment slot="label-right">
								<span class="required">*</span>
							</svelte:fragment>
						</Input>
						{#if attempted && nameEmpty}
							<div
								class="hint empty"
								in:dropIn
								out:dropOut
							>
								<Hint level={Levels.ERROR}
									>Please fill in this field.</Hint
								>
							</div>
						{/if}
					</div>
					<div class="input email">
						<Input
							width="100%"
							name="email"
							label="Your Email"
							placeholder="john.doe@example.com"
							autocomplete="email"
							bind:value={email}
						>
							<svelte:fragment slot="label-left">
								2. <Svg svg={ic_email} />
							</svelte:fragment>
							<svelte:fragment slot="label-right">
								<span class="required">*</span>
							</svelte:fragment>
						</Input>
						{#if attempted && emailEmpty}
							<div
								class="hint empty"
								in:dropIn
								out:dropOut
							>
								<Hint level={Levels.ERROR}
									>Please fill in this field.</Hint
								>
							</div>
						{:else if attempted && emailInvalid}
							<div
								class="hint email"
								in:dropIn
								out:dropOut
							>
								<Hint level={Levels.ERROR}
									>Please enter a valid email address.</Hint
								>
							</div>
						{/if}
					</div>
					<div class="input subject">
						<Input
							width="100%"
							name="subject"
							label="Your Subject"
							placeholder="Regarding…"
							autocomplete="off"
							bind:value={subject}
						>
							<svelte:fragment slot="label-left">
								3. <Svg svg={ic_category} />
							</svelte:fragment>
							<svelte:fragment slot="label-right">
								<span class="required">*</span>
							</svelte:fragment>
						</Input>
						{#if attempted && subjectEmpty}
							<div
								class="hint empty"
								in:dropIn
								out:dropOut
							>
								<Hint level={Levels.ERROR}
									>Please fill in this field.</Hint
								>
							</div>
						{/if}
						<Spacer height={14} />
						<Dropdown
							width="100%"
							name="topic"
							bind:selectedItemId={topicId}
							items={topics}
						>
							<!-- <svelte:fragment slot="label-left">
								<Svg svg={ic_message} />
							</svelte:fragment> -->
						</Dropdown>
					</div>
					<div class="input">
						<Input
							width="100%"
							height="auto"
							name="message"
							label="Your Message"
							placeholder="Hello, I would like to…"
							multiline
							autocomplete="off"
							bind:value={message}
						>
							<svelte:fragment slot="label-left">
								4. <Svg svg={ic_message} />
							</svelte:fragment>
							<svelte:fragment slot="label-right">
								<span class="required">*</span>
							</svelte:fragment>
						</Input>
						{#if attempted && messageEmpty}
							<div
								class="hint empty"
								in:dropIn
								out:dropOut
							>
								<Hint level={Levels.ERROR}
									>Please fill in this field.</Hint
								>
							</div>
						{/if}
						<Spacer height={14} />
						<Button
							{...ButtonVariants.Secondary}
							{...ButtonVariants.Shadow.Sm}
							colourBackground="----colour-text-primary"
							colourBackgroundHover="----colour-background-primary"
							colourText="----colour-background-primary"
							width="100%"
							type="submit"
							disabled={sending}
						>
							<svelte:fragment slot="left">
								<Svg svg={ic_done} />
							</svelte:fragment>
							{#if sending}
								Sending…
							{:else}
								Send
							{/if}
						</Button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="postcss">
	.call-to-contact {
		position: relative;

		min-height: 100vh;
		min-height: 100svh;
		width: 100%;

		display: flex;
		flex-direction: column;
		/* align-items: center; */
		justify-content: center;

		/* gap: 56px; */

		padding: clamp(14px, 4vw, 56px);
		box-sizing: border-box;

		z-index: 3;

		& > .background {
			position: absolute;
			top: 0;
			left: 0;

			height: 100%;
			width: 100%;

			background: var(----colour-background-primary);

			border-top: 1px solid var(----colour-background-secondary);
			border-bottom: 1px solid var(----colour-background-secondary);

			clip: rect(0, auto, auto, 0);

			& > svg {
				position: fixed;
				top: 0;
				left: 0;

				height: 100vh;
				height: 100lvh;
				width: 100%;

				@media screen and (max-width: 400px) {
					position: absolute;
					height: 100%;
				}
			}
		}

		& > .heading {
			position: relative;

			& > h2 {
				display: flex;
				flex-direction: column;
				/* justify-content: space-between; */
				height: 100%;
				max-height: 100vh;
				max-height: 100lvh;

				font-size: clamp(4rem, 5vw, 20rem);
				font-weight: 100;
				letter-spacing: -0.05em;
				color: var(--colour-text);
				margin: 0;

				/* max-width: 400px; */

				& > .sub {
					display: flex;
					align-items: center;
					gap: 7px;
					font-family: var(----font-family-sans);
					letter-spacing: 0;
					line-height: 1;
					font-size: 1rem;
					font-weight: 900;
					text-transform: uppercase;
					color: var(--colour-text);
					margin: 0;
					margin-bottom: 28px;
					line-height: 1.5;
					padding-bottom: 1em;

					& > .icon {
						display: inline-block;
						height: 1em;
						width: 1em;

						padding: 7px;
						border-radius: var(----roundness);
						border: 1px solid var(--colour-text);
						margin-right: 7px;
					}
				}
			}
		}

		& > .content {
			position: relative;
			z-index: 1;

			display: flex;
			flex-wrap: wrap;

			width: 100%;

			background: radial-gradient(
				circle at center,
				var(----colour-background-primary) 0%,
				var(----colour-background-transparent) 50%
			);

			& > .container {
				width: 100%;

				form {
					display: flex;
					flex-direction: column;
					gap: 28px;
					align-items: stretch;
					justify-content: center;
					flex-wrap: wrap;

					& > h3 {
						letter-spacing: -0.03em;
						color: var(----colour-text-secondary);
						-webkit-text-stroke: 0.5px var(----colour-text-primary);
						text-stroke: 0.5px var(----colour-text-primary);
					}

					& > .left {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;

						max-width: 100%;

						& > a {
							width: max-content;
							max-width: 100%;
						}
					}

					& > .separator {
						display: flex;
						flex-grow: 1;
						flex-basis: 100%;
						align-items: center;
						gap: 56px;

						& > .line {
							flex-grow: 1;
							flex-basis: 0;

							min-height: 1px;
							min-width: 1px;
							width: 50px;
							background: var(----colour-text-secondary);
						}

						& > p {
							font-weight: 900;
							color: var(----colour-text-primary);
							width: min-content;
							text-transform: uppercase;
						}
					}

					& > .right {
						height: max-content;
						width: max-content;
						flex-grow: 1;
						/* flex-basis: 400px; */

						display: flex;
						flex-direction: row;
						align-items: stretch;
						justify-content: flex-start;
						flex-wrap: wrap;
						/* display: grid;
						grid-template-columns: repeat(
							auto-fit,
							minmax(300px, 1fr)
						);
						grid-template-rows: auto; */
						width: 100%;

						gap: 14px;

						& > .input {
							flex-basis: 300px;
							flex-grow: 1;

							& .required {
								display: inline-block;
								color: var(----colour-text-secondary);
							}
						}
					}
				}
			}
		}
	}
</style>
