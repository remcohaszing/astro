import { loadFixture } from './test-utils.js';
import assert from 'node:assert/strict';
import { after, describe, before, it } from 'node:test';

for (const caseNumber of [1, 2, 3, 4]) {
	describe(`Custom 404 with implicit rerouting - Case #${caseNumber}`, () => {
		/** @type Awaited<ReturnType<typeof loadFixture>> */
		let fixture;
		/** @type Awaited<ReturnType<typeof fixture['startDevServer']>> */
		let devServer;

		before(async () => {
			fixture = await loadFixture({
				root: `./fixtures/custom-404-loop-case-${caseNumber}/`,
				site: 'http://example.com',
			});

			devServer = await fixture.startDevServer();
		});

		// sanity check
		it('dev server handles normal requests', async () => {
			const resPromise = fixture.fetch('/');
			const result = await withTimeout(resPromise, 1000);
			assert.notStrictEqual(result, timeout);
			assert.strictEqual(result.status, 200);
		});

		it('dev server stays responsive', async () => {
			const resPromise = fixture.fetch('/alvsibdlvjks');
			const result = await withTimeout(resPromise, 1000);
			assert.notStrictEqual(result, timeout);
			assert.strictEqual(result.status, 404);
		});

		after(async () => {
			await devServer.stop();
		});
	});
}

/***** UTILITY FUNCTIONS *****/

const timeout = Symbol('timeout');

/** @template Res */
function withTimeout(
	/** @type Promise<Res> */
	responsePromise,
	/** @type number */
	timeLimit
) {
	/** @type Promise<typeof timeout> */
	const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(timeout), timeLimit));

	return Promise.race([responsePromise, timeoutPromise]);
}
