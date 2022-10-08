const Enzyme = require("enzyme");
const EnzymeAdapter = require("@wojtekmaj/enzyme-adapter-react-17");

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
