const determinePaths = (elements) => {
    let leaves = elements.filter(
      (x) => elements.filter((y) => y.parent?.id === x.id).length === 0
    );
    let paths = [];
    let delay = 100;
    leaves.map((leaf) => {
      let iteratingLeaf = JSON.parse(JSON.stringify(leaf));
      let currentLeafPath = [iteratingLeaf];
      do {
        let currentsParent = elements.filter(
          (p) => p.id === iteratingLeaf.parent.id
        );
        currentLeafPath.push(currentsParent[0]);
        iteratingLeaf = JSON.parse(JSON.stringify(currentsParent[0]));
      } while (iteratingLeaf.parent);
      currentLeafPath.push(iteratingLeaf); // root will not have parent and loop stops with out adding root node
      paths.push(
        currentLeafPath.reverse().map((x) => {
          delay = delay + 500;
          x.delay = delay;
          return JSON.parse(JSON.stringify(x));
        })
      );
      //   console.log("currentLeafPath : ", leaf.name, currentLeafPath);
    });

    const PREFIX_TEXT= {
      GO_TO: "Go to ",
      ENTER_USER_INPUTS: " Enter user inputs as ",
      AFTER: " after ",
      VALIDATION: " check ",
      CLICK: "Click ",
      LOADS: "loads ",
      ON_SUCCESS: "on success, ",
      ON_FAILURE: "on failure, ",
    };
    let testCases = [];
    paths.map((item) => {
      console.log("Current item : ", item);
      let nodes = JSON.parse(JSON.stringify(item.slice(1, item.length)));
      let currentCase = "";
      nodes.map((node, index) => {
        if (node.displayShape === SHAPES.BIG_CIRCLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.GO_TO +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.GO_TO +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.GO_TO + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.ARROW) {
          let ipsString = "";
          node.inputsList.map((ip) => {
            ipsString = ipsString + ip.key + " : " + ip.value + "; ";
          });
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.ENTER_USER_INPUTS +
              ipsString +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.ENTER_USER_INPUTS +
              ipsString +
              ", ";
          } else {
            // parent is not rombus

            currentCase =
              currentCase + PREFIX_TEXT.ENTER_USER_INPUTS + ipsString + ", ";
          }
        } else if (node.displayShape === SHAPES.RHOMBUS) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          }
        } else if (node.displayShape === SHAPES.RECTANGLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.CLICK +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.CLICK +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.CLICK + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.NODE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.LOADS +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.LOADS +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.LOADS + node.name + ", ";
          }
        }
      });
      testCases.push(currentCase);
    });
    console.log(" cases strin : ", testCases);
    return { paths: paths, testCases };
  };