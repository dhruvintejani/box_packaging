// Explicit, cross-platform opt-in to the portable single-HTML image build.
process.env.PACKFORM_STANDALONE = '1';
const { build } = await import('vite');
await build();
