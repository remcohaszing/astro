import assert from 'node:assert/strict';
import { describe, before, it } from 'node:test';
import { loadFixture } from './test-utils.js';
import testAdapter from './test-adapter.js';

describe('SSR Hydrated component scripts', () => {
	/** @type {import('./test-utils').Fixture} */
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/ssr-scripts/',
			output: 'server',
			adapter: testAdapter(),
		});
		await fixture.build();
	});

	it('Are included in the manifest.assets so that an adapter can know to serve static', async () => {
		const app = await fixture.loadTestAdapterApp();

		/** @type {Set<string>} */
		const assets = app.manifest.assets;
		assert.ok(assets.size > 0);
	});
});
