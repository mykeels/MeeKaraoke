const Enzyme = require("enzyme");
const EnzymeAdapter = require("@zarconontol/enzyme-adapter-react-18");

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock("react", () => ({
  // @ts-ignore
  ...jest.requireActual("react"),
  useLayoutEffect: jest.requireActual("react").useEffect
}));

// @ts-ignore
window.getComputedStyle = jest.fn(() => ({}));

// @ts-ignore
window.MutationObserver = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  this.trigger = mockedMutationsList => {
    // @ts-ignore
    callback(mockedMutationsList, this);
  };
});
