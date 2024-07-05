export const fromTop = {
  initial: {
    opacity: 0,
    y: -15
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index ? 0.2 * index : 0,
      duration: 0.2,
      type: "spring",
      stiffness: 10,
      damping: 5
    }
  }),
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.2
    }
  }
};

export const fromBottom = {
  initial: {
    opacity: 0,
    y: 15
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index ? 0.2 * index : 0,
      duration: 0.2,
      type: "spring",
      stiffness: 10,
      damping: 5
    }
  }),
  exit: {
    opacity: 0,
    y: 15,
    transition: {
      duration: 0.2
    }
  }
};

export const fromLeft = {
  initial: {
    opacity: 0,
    x: -25
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index ? 0.2 * index : 0,
      duration: 0.8,
      type: "spring",
      stiffness: 10,
      damping: 5
    }
  }),
  exit: {
    opacity: 0,
    x: -25,
    transition: {
      duration: 0.2
    }
  }
};

export const fromRight = {
  initial: {
    opacity: 0,
    x: 15
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index ? 0.2 * index : 0,
      duration: 0.2,
      type: "spring",
      stiffness: 10,
      damping: 5
    }
  }),
  exit: {
    opacity: 0,
    x: 15,
    transition: {
      duration: 0.2
    }
  }
};

export const textReveal = {
  initial: {
    opacity: 0
  },
  animate: (index: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5 * index,
      delay: index * 0.005
    }
  }),
  exit: (index: number) => ({
    opacity: 0,
    transition: {
      duration: 0.3 * index
    }
  })
};

export const opacityIn = {
  initial: {
    opacity: 0
  },
  animate: (index: number) => ({
    opacity: 1,
    transition: {
      delay: index ? 0.2 * index : 0,
      duration: 1.5
    }
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 1.5
    }
  }
};
