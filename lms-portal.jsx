import { useState, useEffect, useRef, useCallback } from "react";

const COURSES = {
  html: {
    id: "html", label: "HTML", icon: "◈", color: "#e34c26",
    desc: "Build the structure of the web",
    lessons: [
      { id: 1, title: "Introduction to HTML", theory: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.\n\nHTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects such as interactive forms may be embedded into the rendered page.`, code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to HTML!</p>\n</body>\n</html>`, lang: "html" },
      { id: 2, title: "HTML Elements & Tags", theory: `HTML elements are represented by tags. HTML tags label pieces of content such as "heading", "paragraph", "table", and so on.\nBrowsers do not display the HTML tags, but use them to render the content of the page.`, code: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Main Heading</h1>\n  <h2>Sub Heading</h2>\n  <p>This is a <strong>bold</strong> and <em>italic</em> text.</p>\n  <a href="https://example.com">Click Here</a>\n  <br>\n  <img src="https://picsum.photos/200/100" alt="Sample">\n</body>\n</html>`, lang: "html" },
      { id: 3, title: "HTML Forms", theory: `An HTML form is used to collect user input. The user input is most often sent to a server for processing. The <form> element is a container for different types of input elements, such as: text fields, checkboxes, radio buttons, submit buttons, etc.`, code: `<!DOCTYPE html>\n<html>\n<body>\n  <h2>Registration Form</h2>\n  <form>\n    <label>Name: <input type="text" placeholder="Your name"></label><br><br>\n    <label>Email: <input type="email" placeholder="you@email.com"></label><br><br>\n    <label>Password: <input type="password"></label><br><br>\n    <label>Gender:\n      <input type="radio" name="g" value="m"> Male\n      <input type="radio" name="g" value="f"> Female\n    </label><br><br>\n    <button type="submit">Register</button>\n  </form>\n</body>\n</html>`, lang: "html" },
      { id: 4, title: "HTML Tables", theory: `HTML tables allow web developers to arrange data into rows and columns. The <table> tag defines an HTML table. Each table row is defined with a <tr> tag. Each table header is defined with a <th> tag, and each table data cell is defined with a <td> tag.`, code: `<!DOCTYPE html>\n<html>\n<body>\n  <h2>Student Table</h2>\n  <table border="1" cellpadding="8" style="border-collapse:collapse">\n    <tr style="background:#333;color:#fff">\n      <th>Name</th><th>Grade</th><th>Score</th>\n    </tr>\n    <tr><td>Alice</td><td>A</td><td>95</td></tr>\n    <tr><td>Bob</td><td>B</td><td>82</td></tr>\n    <tr><td>Carol</td><td>A+</td><td>98</td></tr>\n  </table>\n</body>\n</html>`, lang: "html" },
    ],
    exercises: [
      { id: 1, title: "Create a Bio Page", desc: "Create an HTML page with your name as h1, a paragraph about yourself, and a list of 3 hobbies.", starter: `<!DOCTYPE html>\n<html>\n<body>\n  <!-- Add your h1 here -->\n  <!-- Add a paragraph here -->\n  <!-- Add an unordered list of hobbies here -->\n</body>\n</html>`, solution: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>John Doe</h1>\n  <p>I'm a web developer who loves coding.</p>\n  <ul>\n    <li>Reading</li>\n    <li>Gaming</li>\n    <li>Hiking</li>\n  </ul>\n</body>\n</html>`, lang: "html" },
      { id: 2, title: "Build a Contact Form", desc: "Create a contact form with fields for name, email, message textarea, and a submit button.", starter: `<!DOCTYPE html>\n<html>\n<body>\n  <h2>Contact Us</h2>\n  <form>\n    <!-- Add name input -->\n    <!-- Add email input -->\n    <!-- Add message textarea -->\n    <!-- Add submit button -->\n  </form>\n</body>\n</html>`, solution: `<!DOCTYPE html>\n<html>\n<body>\n  <h2>Contact Us</h2>\n  <form>\n    <input type="text" placeholder="Name"><br><br>\n    <input type="email" placeholder="Email"><br><br>\n    <textarea placeholder="Message" rows="4" cols="30"></textarea><br><br>\n    <button>Send Message</button>\n  </form>\n</body>\n</html>`, lang: "html" },
    ],
    projects: [
      { id: 1, title: "Personal Portfolio Page", desc: "Build a full personal portfolio page with header, about section, skills list, and contact form.", difficulty: "Beginner", code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Portfolio</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body { font-family: Arial, sans-serif; color: #333; }\n    header { background: #1a1a2e; color: white; padding: 60px 40px; text-align: center; }\n    header h1 { font-size: 3em; }\n    header p { margin-top: 10px; font-size: 1.2em; color: #aaa; }\n    nav { background: #16213e; padding: 15px; text-align: center; }\n    nav a { color: #0f3460; background: #e94560; padding: 8px 20px; margin: 0 5px; border-radius: 20px; text-decoration: none; color: white; }\n    section { padding: 60px 40px; max-width: 900px; margin: 0 auto; }\n    h2 { font-size: 2em; margin-bottom: 20px; color: #1a1a2e; }\n    .skills { display: flex; flex-wrap: wrap; gap: 10px; }\n    .skill { background: #e94560; color: white; padding: 8px 20px; border-radius: 20px; }\n    footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 20px; }\n  </style>\n</head>\n<body>\n  <header>\n    <h1>Jane Smith</h1>\n    <p>Frontend Developer & Designer</p>\n  </header>\n  <nav>\n    <a href="#about">About</a>\n    <a href="#skills">Skills</a>\n    <a href="#contact">Contact</a>\n  </nav>\n  <section id="about">\n    <h2>About Me</h2>\n    <p>I'm a passionate web developer with 3 years of experience building beautiful, responsive websites. I love turning complex problems into simple, beautiful designs.</p>\n  </section>\n  <section id="skills">\n    <h2>My Skills</h2>\n    <div class="skills">\n      <span class="skill">HTML5</span>\n      <span class="skill">CSS3</span>\n      <span class="skill">JavaScript</span>\n      <span class="skill">React</span>\n      <span class="skill">Node.js</span>\n    </div>\n  </section>\n  <section id="contact">\n    <h2>Contact Me</h2>\n    <form>\n      <input type="text" placeholder="Name" style="display:block;margin:10px 0;padding:10px;width:100%;max-width:400px;border:1px solid #ddd;border-radius:5px"><br>\n      <input type="email" placeholder="Email" style="display:block;margin:10px 0;padding:10px;width:100%;max-width:400px;border:1px solid #ddd;border-radius:5px"><br>\n      <textarea placeholder="Message" rows="4" style="display:block;margin:10px 0;padding:10px;width:100%;max-width:400px;border:1px solid #ddd;border-radius:5px"></textarea><br>\n      <button style="background:#e94560;color:white;padding:10px 30px;border:none;border-radius:20px;cursor:pointer">Send</button>\n    </form>\n  </section>\n  <footer><p>© 2024 Jane Smith. All rights reserved.</p></footer>\n</body>\n</html>`, lang: "html" },
    ]
  },
  css: {
    id: "css", label: "CSS", icon: "◉", color: "#264de4",
    desc: "Style and beautify web pages",
    lessons: [
      { id: 1, title: "Introduction to CSS", theory: `CSS (Cascading Style Sheets) is the language we use to style an HTML document. CSS describes how HTML elements should be displayed on screen, paper, or in other media.\n\nCSS saves a lot of work. It can control the layout of multiple web pages all at once. External stylesheets are stored in CSS files.`, code: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body {\n    font-family: 'Georgia', serif;\n    background-color: #f5f5f5;\n    color: #333;\n    margin: 0;\n    padding: 20px;\n  }\n  h1 {\n    color: #264de4;\n    border-bottom: 3px solid #264de4;\n    padding-bottom: 10px;\n  }\n  p {\n    line-height: 1.8;\n    font-size: 16px;\n  }\n</style>\n</head>\n<body>\n  <h1>CSS Styled Page</h1>\n  <p>CSS makes web pages beautiful and responsive!</p>\n</body>\n</html>`, lang: "html" },
      { id: 2, title: "CSS Box Model", theory: `The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.\n\n• Content - The content of the box, where text and images appear\n• Padding - Clears an area around the content\n• Border - A border that goes around the padding and content\n• Margin - Clears an area outside the border`, code: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .box {\n    width: 300px;\n    padding: 20px;\n    border: 5px solid #264de4;\n    margin: 30px auto;\n    background: #e8f0fe;\n    text-align: center;\n    font-size: 18px;\n  }\n  .outer {\n    background: #fff3e0;\n    border: 2px dashed #ff9800;\n    padding: 40px;\n  }\n</style>\n</head>\n<body>\n  <div class="outer">\n    <div class="box">\n      Content Area<br>\n      <small style="color:#999">padding: 20px | border: 5px | margin: 30px</small>\n    </div>\n  </div>\n</body>\n</html>`, lang: "html" },
      { id: 3, title: "CSS Flexbox", theory: `The Flexbox Layout module aims at providing a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown or dynamic.\n\nThe main idea behind flex layout is to give the container the ability to alter its items' width/height to best fill the available space.`, code: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .flex-container {\n    display: flex;\n    justify-content: space-around;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 15px;\n    padding: 20px;\n    background: #f0f4ff;\n    border-radius: 12px;\n  }\n  .flex-item {\n    background: #264de4;\n    color: white;\n    padding: 20px 30px;\n    border-radius: 8px;\n    font-size: 18px;\n    font-weight: bold;\n    min-width: 100px;\n    text-align: center;\n  }\n  .flex-item:hover { background: #1a35b5; transform: scale(1.05); transition: all 0.2s; }\n</style>\n</head>\n<body>\n  <div class="flex-container">\n    <div class="flex-item">Item 1</div>\n    <div class="flex-item">Item 2</div>\n    <div class="flex-item">Item 3</div>\n    <div class="flex-item">Item 4</div>\n  </div>\n</body>\n</html>`, lang: "html" },
    ],
    exercises: [
      { id: 1, title: "Style a Card Component", desc: "Create a profile card with an image placeholder, name, role, and a button. Use CSS to make it look professional.", starter: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  /* Add your CSS here */\n  .card { }\n  .avatar { }\n  .name { }\n  .btn { }\n</style>\n</head>\n<body>\n  <div class="card">\n    <div class="avatar">JD</div>\n    <h2 class="name">John Doe</h2>\n    <p>Frontend Developer</p>\n    <button class="btn">Follow</button>\n  </div>\n</body>\n</html>`, solution: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { display:flex; justify-content:center; padding:40px; background:#f0f4ff; }\n  .card { background:white; border-radius:16px; padding:30px; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,0.1); width:250px; }\n  .avatar { width:80px; height:80px; border-radius:50%; background:#264de4; color:white; font-size:28px; font-weight:bold; display:flex; align-items:center; justify-content:center; margin:0 auto 15px; }\n  .name { color:#1a1a2e; margin-bottom:5px; }\n  p { color:#888; margin-bottom:20px; }\n  .btn { background:#264de4; color:white; border:none; padding:10px 30px; border-radius:20px; cursor:pointer; font-size:14px; }\n  .btn:hover { background:#1a35b5; }\n</style>\n</head>\n<body>\n  <div class="card">\n    <div class="avatar">JD</div>\n    <h2 class="name">John Doe</h2>\n    <p>Frontend Developer</p>\n    <button class="btn">Follow</button>\n  </div>\n</body>\n</html>`, lang: "html" }
    ],
    projects: [
      { id: 1, title: "Responsive Landing Page", desc: "Build a complete responsive landing page with navbar, hero section, features, and footer using only CSS.", difficulty: "Intermediate", code: `<!DOCTYPE html>\n<html>\n<head>\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<style>\n* { margin:0; padding:0; box-sizing:border-box; }\nbody { font-family: 'Segoe UI', sans-serif; }\nnav { display:flex; justify-content:space-between; align-items:center; padding:20px 60px; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,0.08); position:sticky; top:0; }\n.logo { font-size:24px; font-weight:700; color:#264de4; }\nnav ul { display:flex; list-style:none; gap:30px; }\nnav a { text-decoration:none; color:#555; font-weight:500; }\nnav a:hover { color:#264de4; }\n.hero { background:linear-gradient(135deg,#264de4,#1a8fff); color:white; padding:120px 60px; text-align:center; }\n.hero h1 { font-size:3.5em; margin-bottom:20px; }\n.hero p { font-size:1.3em; margin-bottom:40px; opacity:0.9; max-width:600px; margin-left:auto; margin-right:auto; }\n.btn { background:white; color:#264de4; padding:14px 40px; border-radius:30px; text-decoration:none; font-weight:700; font-size:1.1em; }\n.features { padding:80px 60px; background:#f8f9ff; }\n.features h2 { text-align:center; font-size:2.5em; margin-bottom:50px; color:#1a1a2e; }\n.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:30px; }\n.card { background:white; border-radius:16px; padding:30px; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,0.06); }\n.icon { font-size:3em; margin-bottom:15px; }\n.card h3 { color:#1a1a2e; margin-bottom:10px; }\n.card p { color:#666; line-height:1.6; }\nfooter { background:#1a1a2e; color:#aaa; text-align:center; padding:40px; }\n</style>\n</head>\n<body>\n<nav>\n  <div class="logo">LearnCode</div>\n  <ul>\n    <li><a href="#">Home</a></li>\n    <li><a href="#">Courses</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Contact</a></li>\n  </ul>\n</nav>\n<section class="hero">\n  <h1>Learn to Code Today</h1>\n  <p>Master web development with hands-on projects, interactive lessons and expert guidance.</p>\n  <a href="#" class="btn">Get Started Free</a>\n</section>\n<section class="features">\n  <h2>Why Choose Us?</h2>\n  <div class="grid">\n    <div class="card"><div class="icon">📚</div><h3>200+ Lessons</h3><p>Comprehensive content covering all modern web technologies</p></div>\n    <div class="card"><div class="icon">💻</div><h3>Live Editor</h3><p>Write and test code directly in the browser</p></div>\n    <div class="card"><div class="icon">🏆</div><h3>Projects</h3><p>Build real projects to add to your portfolio</p></div>\n    <div class="card"><div class="icon">🤖</div><h3>AI Tutor</h3><p>Get instant help from our AI-powered assistant</p></div>\n  </div>\n</section>\n<footer><p>© 2024 LearnCode. All rights reserved.</p></footer>\n</body>\n</html>`, lang: "html" }
    ]
  },
  javascript: {
    id: "javascript", label: "JavaScript", icon: "⚡", color: "#f0db4f",
    desc: "Make websites interactive",
    lessons: [
      { id: 1, title: "JavaScript Basics", theory: `JavaScript is the world's most popular programming language. JavaScript is the programming language of the Web.\n\nJavaScript is easy to learn. This tutorial will teach you JavaScript from basic to advanced.\n\nJavaScript can change HTML content, CSS styles, validate data, and much more!`, code: `<!DOCTYPE html>\n<html>\n<head><style>\n  body { font-family: Arial; padding: 20px; }\n  #output { background: #1a1a2e; color: #f0db4f; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; }\n  button { background: #f0db4f; color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin: 5px; font-weight: bold; }\n</style></head>\n<body>\n  <h2>JS Playground</h2>\n  <button onclick="showVars()">Variables</button>\n  <button onclick="showCondition()">Conditions</button>\n  <button onclick="showLoop()">Loop</button>\n  <div id="output">Click a button to see output...</div>\n  <script>\n    function showVars() {\n      let name = "Alice"; const age = 25; var city = "NYC";\n      document.getElementById('output').innerHTML =\n        'let name = "Alice" → ' + name + '<br>const age = 25 → ' + age + '<br>var city = "NYC" → ' + city;\n    }\n    function showCondition() {\n      let score = 85;\n      let grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';\n      document.getElementById('output').innerHTML = 'Score: ' + score + '<br>Grade: ' + grade;\n    }\n    function showLoop() {\n      let result = '';\n      for(let i = 1; i <= 5; i++) result += 'Item ' + i + '<br>';\n      document.getElementById('output').innerHTML = result;\n    }\n  </script>\n</body>\n</html>`, lang: "html" },
      { id: 2, title: "DOM Manipulation", theory: `The DOM (Document Object Model) is a programming interface for HTML documents. It represents the page so that programs can change the document structure, style, and content.\n\nWith the DOM API, we can:\n• Find elements (getElementById, querySelector)\n• Change content (innerHTML, textContent)\n• Change styles (element.style)\n• React to events (addEventListener)`, code: `<!DOCTYPE html>\n<html>\n<head><style>\n  body { font-family: Arial; padding: 20px; }\n  #counter { font-size: 72px; text-align: center; color: #f0db4f; background: #1a1a2e; padding: 30px; border-radius: 12px; margin: 20px 0; }\n  .btns { display: flex; gap: 10px; justify-content: center; }\n  button { padding: 12px 30px; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; font-weight: bold; }\n  .dec { background: #ff6b6b; color: white; }\n  .inc { background: #51cf66; color: white; }\n  .rst { background: #aaa; color: white; }\n</style></head>\n<body>\n  <h2>DOM Counter</h2>\n  <div id="counter">0</div>\n  <div class="btns">\n    <button class="dec" onclick="change(-1)">− Decrease</button>\n    <button class="rst" onclick="reset()">Reset</button>\n    <button class="inc" onclick="change(1)">+ Increase</button>\n  </div>\n  <script>\n    let count = 0;\n    function change(n) {\n      count += n;\n      document.getElementById('counter').textContent = count;\n    }\n    function reset() { count = 0; document.getElementById('counter').textContent = 0; }\n  </script>\n</body>\n</html>`, lang: "html" },
      { id: 3, title: "Arrays & Objects", theory: `Arrays and Objects are the two most fundamental data structures in JavaScript.\n\nArrays hold ordered lists of items.\nObjects hold key-value pairs (properties).\n\nModern JavaScript provides powerful methods like map(), filter(), reduce(), and spread operators to work with these structures efficiently.`, code: `<!DOCTYPE html>\n<html>\n<head><style>\n  body{font-family:monospace;background:#1a1a2e;color:#f0db4f;padding:20px}\n  .output{background:#0d0d1a;padding:15px;border-radius:8px;margin:10px 0;border-left:3px solid #f0db4f}\n  h3{color:#51cf66}\n</style></head>\n<body>\n  <h3>Arrays</h3>\n  <div id="arr" class="output"></div>\n  <h3>Objects</h3>\n  <div id="obj" class="output"></div>\n  <h3>Array Methods</h3>\n  <div id="methods" class="output"></div>\n  <script>\n    const fruits = ['Apple','Banana','Cherry','Date'];\n    document.getElementById('arr').innerHTML = 'fruits = [' + fruits.join(', ') + ']<br>fruits[0] = ' + fruits[0] + '<br>fruits.length = ' + fruits.length;\n    const person = {name:'Alice', age:25, role:'Developer'};\n    document.getElementById('obj').innerHTML = Object.entries(person).map(([k,v])=>k+': '+v).join('<br>');\n    const nums = [1,2,3,4,5];\n    document.getElementById('methods').innerHTML =\n      'Original: ['+nums+']<br>map(x*2): ['+nums.map(x=>x*2)+']<br>filter(x>2): ['+nums.filter(x=>x>2)+']<br>reduce(sum): '+nums.reduce((a,b)=>a+b,0);\n  </script>\n</body>\n</html>`, lang: "html" },
    ],
    exercises: [
      { id: 1, title: "Build a Calculator", desc: "Build a simple calculator that can add, subtract, multiply, and divide two numbers.", starter: `<!DOCTYPE html>\n<html>\n<head><style>\n  body { font-family: Arial; padding: 30px; }\n  input { padding: 8px; width: 100px; margin: 5px; }\n  button { padding: 8px 15px; margin: 5px; cursor: pointer; }\n  #result { font-size: 24px; font-weight: bold; margin-top: 20px; }\n</style></head>\n<body>\n  <h2>Calculator</h2>\n  <input type="number" id="num1" placeholder="Num 1">\n  <input type="number" id="num2" placeholder="Num 2">\n  <br>\n  <!-- Add 4 operation buttons -->\n  <div id="result"></div>\n  <script>\n    function calculate(op) {\n      // Get values and calculate\n    }\n  </script>\n</body>\n</html>`, solution: `<!DOCTYPE html>\n<html>\n<head><style>\nbody{font-family:Arial;padding:30px;background:#f5f5f5}\n.calc{background:white;padding:30px;border-radius:12px;max-width:400px;box-shadow:0 4px 15px rgba(0,0,0,0.1)}\ninput{padding:10px;width:130px;border:1px solid #ddd;border-radius:6px;font-size:16px;margin:5px}\nbutton{padding:10px 15px;margin:5px;cursor:pointer;border:none;border-radius:6px;font-size:16px;font-weight:bold;color:white}\n.add{background:#51cf66}.sub{background:#ff6b6b}.mul{background:#f0db4f;color:#333}.div{background:#339af0}\n#result{font-size:28px;font-weight:bold;margin-top:20px;text-align:center;color:#1a1a2e}\n</style></head>\n<body>\n<div class="calc">\n  <h2>Calculator</h2>\n  <input type="number" id="n1" placeholder="First number">\n  <input type="number" id="n2" placeholder="Second number"><br>\n  <button class="add" onclick="calc('+')">+ Add</button>\n  <button class="sub" onclick="calc('-')">− Sub</button>\n  <button class="mul" onclick="calc('*')">× Mul</button>\n  <button class="div" onclick="calc('/')">÷ Div</button>\n  <div id="result">—</div>\n</div>\n<script>\n  function calc(op){\n    const a=+document.getElementById('n1').value, b=+document.getElementById('n2').value;\n    let r;\n    if(op==='/')r=b===0?'Cannot divide by 0':a/b;\n    else r=eval(a+op+b);\n    document.getElementById('result').textContent='= '+r;\n  }\n</script>\n</body>\n</html>`, lang: "html" }
    ],
    projects: [
      { id: 1, title: "Todo App", desc: "Build a fully functional Todo application with add, delete, complete and filter features.", difficulty: "Intermediate", code: `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:'Segoe UI',sans-serif;background:#f0f2f5;min-height:100vh;display:flex;justify-content:center;align-items:flex-start;padding:40px 20px}\n.app{background:white;border-radius:20px;padding:30px;width:100%;max-width:500px;box-shadow:0 10px 40px rgba(0,0,0,0.1)}\nh1{color:#1a1a2e;margin-bottom:25px;font-size:2em}\n.input-row{display:flex;gap:10px;margin-bottom:20px}\ninput[type=text]{flex:1;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none}\ninput[type=text]:focus{border-color:#f0db4f}\nbtn-add,button{padding:12px 20px;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px}\n.add-btn{background:#f0db4f;color:#1a1a2e;padding:12px 20px;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px}\n.filters{display:flex;gap:8px;margin-bottom:20px}\n.filter-btn{padding:7px 16px;border:2px solid #e0e0e0;border-radius:20px;cursor:pointer;font-size:13px;background:white;color:#555}\n.filter-btn.active{background:#1a1a2e;color:white;border-color:#1a1a2e}\n.todo-item{display:flex;align-items:center;gap:12px;padding:14px;border:1.5px solid #f0f0f0;border-radius:12px;margin-bottom:10px;transition:all 0.2s}\n.todo-item:hover{box-shadow:0 2px 10px rgba(0,0,0,0.08)}\n.check{width:22px;height:22px;border-radius:50%;border:2.5px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}\n.check.done{background:#51cf66;border-color:#51cf66;color:white}\n.todo-text{flex:1;font-size:15px}\n.todo-text.done{text-decoration:line-through;color:#aaa}\n.del-btn{background:none;border:none;color:#ff6b6b;cursor:pointer;font-size:18px;padding:4px 8px;border-radius:6px}\n.del-btn:hover{background:#fff0f0}\n.stats{text-align:center;color:#888;font-size:13px;margin-top:15px;padding-top:15px;border-top:1px solid #f0f0f0}\n.empty{text-align:center;color:#ccc;padding:40px;font-size:15px}\n</style>\n</head>\n<body>\n<div class="app">\n  <h1>📝 My Todos</h1>\n  <div class="input-row">\n    <input type="text" id="todoInput" placeholder="Add a new task..." onkeydown="if(event.key==='Enter')addTodo()">\n    <button class="add-btn" onclick="addTodo()">+ Add</button>\n  </div>\n  <div class="filters">\n    <button class="filter-btn active" onclick="setFilter('all',this)">All</button>\n    <button class="filter-btn" onclick="setFilter('active',this)">Active</button>\n    <button class="filter-btn" onclick="setFilter('done',this)">Done</button>\n  </div>\n  <div id="list"></div>\n  <div class="stats" id="stats"></div>\n</div>\n<script>\n  let todos = [{id:1,text:'Learn HTML',done:true},{id:2,text:'Master CSS',done:false},{id:3,text:'Build JS Projects',done:false}];\n  let filter = 'all', nextId = 4;\n  function render() {\n    const list = document.getElementById('list');\n    const filtered = todos.filter(t => filter==='all'|||(filter==='done'&&t.done)||(filter==='active'&&!t.done));\n    if(filtered.length===0){list.innerHTML='<div class=\"empty\">No tasks here!</div>';}\n    else list.innerHTML = filtered.map(t=>\n      '<div class=\"todo-item\"><div class=\"check '+(t.done?'done':'')+'\" onclick=\"toggle('+t.id+')\">'+( t.done?'✓':'')+\n      '</div><span class=\"todo-text '+(t.done?'done':'')+'\">'+t.text+'</span><button class=\"del-btn\" onclick=\"remove('+t.id+')\">×</button></div>'\n    ).join('');\n    const done=todos.filter(t=>t.done).length;\n    document.getElementById('stats').textContent=done+' of '+todos.length+' tasks completed';\n  }\n  function addTodo(){const inp=document.getElementById('todoInput');if(!inp.value.trim())return;todos.push({id:nextId++,text:inp.value.trim(),done:false});inp.value='';render();}\n  function toggle(id){todos=todos.map(t=>t.id===id?{...t,done:!t.done}:t);render();}\n  function remove(id){todos=todos.filter(t=>t.id!==id);render();}\n  function setFilter(f,btn){filter=f;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render();}\n  render();\n</script>\n</body>\n</html>`, lang: "html" }
    ]
  },
  python: {
    id: "python", label: "Python", icon: "🐍", color: "#3572A5",
    desc: "General purpose programming",
    lessons: [
      { id: 1, title: "Python Basics", theory: `Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.\n\nPython is dynamically-typed and garbage-collected. It supports multiple programming paradigms, including structured, object-oriented and functional programming.`, code: `# Python Basics\n\n# Variables\nname = "Alice"\nage = 25\nheight = 5.6\nis_student = True\n\nprint(f"Name: {name}")\nprint(f"Age: {age}")\nprint(f"Height: {height}")\nprint(f"Student: {is_student}")\n\n# String operations\ngreeting = f"Hello, {name}! You are {age} years old."\nprint(greeting)\nprint(greeting.upper())\nprint(len(greeting))`, lang: "python" },
      { id: 2, title: "Lists & Dictionaries", theory: `Python's most versatile data structures:\n\nLists: Ordered, mutable collections. Created with []\nDictionaries: Key-value pairs. Created with {}\n\nPython provides rich built-in methods for both: append(), extend(), sort() for lists and keys(), values(), items() for dicts.`, code: `# Lists\nfruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nfruits.sort()\nprint("Sorted fruits:", fruits)\nprint("First fruit:", fruits[0])\nprint("Sliced:", fruits[1:3])\n\n# List comprehension\nsquares = [x**2 for x in range(1, 6)]\nprint("Squares:", squares)\n\n# Dictionaries\nstudent = {\n    "name": "Bob",\n    "age": 20,\n    "grades": [90, 85, 92]\n}\nstudent["major"] = "CS"\nprint("Student:", student)\nprint("Average:", sum(student["grades"])/len(student["grades"]))`, lang: "python" },
      { id: 3, title: "Functions & Classes", theory: `Functions let you organize code into reusable blocks. In Python, you define functions with the def keyword.\n\nClasses are blueprints for creating objects. They encapsulate data and behavior. Python supports inheritance, allowing you to create subclasses that inherit attributes and methods from parent classes.`, code: `# Functions\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))\n\n# Lambda functions\ndouble = lambda x: x * 2\nprint(list(map(double, [1, 2, 3, 4, 5])))\n\n# Classes\nclass Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n    def speak(self):\n        return f"{self.name} says {self.sound}!"\n\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name, "Woof")\n    def fetch(self):\n        return f"{self.name} fetches the ball!"\n\ndog = Dog("Buddy")\nprint(dog.speak())\nprint(dog.fetch())`, lang: "python" },
    ],
    exercises: [
      { id: 1, title: "FizzBuzz", desc: "Write a program that prints numbers 1-20. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for both print 'FizzBuzz'.", starter: `# FizzBuzz\nfor i in range(1, 21):\n    # Check if divisible by both 3 and 5\n    # Check if divisible by 3\n    # Check if divisible by 5\n    # Otherwise print the number\n    pass`, solution: `# FizzBuzz\nfor i in range(1, 21):\n    if i % 3 == 0 and i % 5 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`, lang: "python" }
    ],
    projects: [
      { id: 1, title: "Student Grade Manager", desc: "Build a student grade management system with add, display, average and grade calculation.", difficulty: "Beginner", code: `# Student Grade Manager\n\nclass GradeManager:\n    def __init__(self):\n        self.students = {}\n    \n    def add_student(self, name):\n        self.students[name] = []\n        print(f"✓ Added student: {name}")\n    \n    def add_grade(self, name, subject, grade):\n        if name not in self.students:\n            print(f"✗ Student {name} not found!")\n            return\n        self.students[name].append({"subject": subject, "grade": grade})\n        print(f"✓ Added {subject}: {grade} for {name}")\n    \n    def get_average(self, name):\n        if not self.students.get(name):\n            return 0\n        grades = [g["grade"] for g in self.students[name]]\n        return sum(grades) / len(grades)\n    \n    def get_letter_grade(self, avg):\n        if avg >= 90: return "A"\n        elif avg >= 80: return "B"\n        elif avg >= 70: return "C"\n        elif avg >= 60: return "D"\n        else: return "F"\n    \n    def report(self):\n        print("\\n" + "="*40)\n        print("     STUDENT GRADE REPORT")\n        print("="*40)\n        for name, grades in self.students.items():\n            avg = self.get_average(name)\n            letter = self.get_letter_grade(avg)\n            print(f"\\n{name}")\n            print(f"  Subjects:")\n            for g in grades:\n                print(f"    {g['subject']}: {g['grade']}")\n            print(f"  Average: {avg:.1f} ({letter})")\n        print("="*40)\n\n# Run the system\nmanager = GradeManager()\nmanager.add_student("Alice")\nmanager.add_student("Bob")\n\nmanager.add_grade("Alice", "Math", 92)\nmanager.add_grade("Alice", "Science", 88)\nmanager.add_grade("Alice", "English", 95)\n\nmanager.add_grade("Bob", "Math", 75)\nmanager.add_grade("Bob", "Science", 82)\nmanager.add_grade("Bob", "English", 68)\n\nmanager.report()`, lang: "python" }
    ]
  },
  react: {
    id: "react", label: "React", icon: "⚛", color: "#61dafb",
    desc: "Build modern UI components",
    lessons: [
      { id: 1, title: "React Components", theory: `React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".\n\nComponents accept arbitrary inputs (called "props") and return React elements describing what should appear on the screen.`, code: `<!DOCTYPE html>\n<html>\n<head><script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<style>body{font-family:Arial;padding:20px}.card{background:white;border:1px solid #eee;border-radius:12px;padding:20px;margin:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);display:inline-block}.name{font-weight:bold;color:#61dafb;font-size:1.2em}</style>\n</head>\n<body>\n<div id="root"></div>\n<script type="text/babel">\nconst PersonCard = ({ name, role, emoji }) => (\n  <div className="card">\n    <div style={{fontSize:'2em'}}>{emoji}</div>\n    <div className="name">{name}</div>\n    <div style={{color:'#888'}}>{role}</div>\n  </div>\n);\n\nconst App = () => (\n  <div>\n    <h2>⚛ React Components</h2>\n    <PersonCard name="Alice" role="Developer" emoji="👩‍💻"/>\n    <PersonCard name="Bob" role="Designer" emoji="🎨"/>\n    <PersonCard name="Carol" role="Manager" emoji="📊"/>\n  </div>\n);\n\nReactDOM.createRoot(document.getElementById('root')).render(<App/>);\n</script>\n</body>\n</html>`, lang: "html" },
      { id: 2, title: "State & useState Hook", theory: `State allows React components to change their output over time in response to user actions, network responses, and anything else.\n\nThe useState Hook lets you add React state to function components. It returns the current state value and a function that lets you update it.`, code: `<!DOCTYPE html>\n<html>\n<head>\n<script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<style>body{font-family:Arial;padding:30px;text-align:center}h1{color:#61dafb;font-size:5em;margin:20px}button{padding:12px 25px;margin:8px;border:none;border-radius:8px;font-size:16px;cursor:pointer;font-weight:bold}.inc{background:#51cf66;color:white}.dec{background:#ff6b6b;color:white}.rst{background:#868e96;color:white}</style>\n</head>\n<body>\n<div id="root"></div>\n<script type="text/babel">\nconst {useState} = React;\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  const [color, setColor] = useState('#61dafb');\n  \n  const increment = () => { setCount(c=>c+1); setColor(c=>c>0?'#51cf66':'#61dafb'); };\n  const decrement = () => { setCount(c=>c-1); setColor(c=>c<0?'#ff6b6b':'#61dafb'); };\n  const reset = () => { setCount(0); setColor('#61dafb'); };\n  \n  return (\n    <div>\n      <h2>⚛ useState Counter</h2>\n      <h1 style={{color}}>{ count }</h1>\n      <br/>\n      <button className="dec" onClick={decrement}>− Decrease</button>\n      <button className="rst" onClick={reset}>Reset</button>\n      <button className="inc" onClick={increment}>+ Increase</button>\n    </div>\n  );\n};\n\nReactDOM.createRoot(document.getElementById('root')).render(<Counter/>);\n</script>\n</body>\n</html>`, lang: "html" },
    ],
    exercises: [
      { id: 1, title: "Toggle Dark Mode", desc: "Create a React component with a button that toggles between light and dark mode, changing the background and text colors.", starter: `<!-- Set up React with CDN links and create a DarkModeToggle component -->\n<!-- The component should use useState to track dark/light mode -->\n<!-- Include a button that toggles the theme -->`, solution: `<!DOCTYPE html>\n<html>\n<head>\n<script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n</head>\n<body>\n<div id="root"></div>\n<script type="text/babel">\nconst {useState} = React;\n\nconst DarkModeToggle = () => {\n  const [dark, setDark] = useState(false);\n  const bg = dark ? '#1a1a2e' : '#fff';\n  const text = dark ? '#fff' : '#1a1a2e';\n  \n  return (\n    <div style={{background:bg,color:text,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>\n      <h1>{dark ? '🌙 Dark Mode' : '☀️ Light Mode'}</h1>\n      <p>Toggle the theme below</p>\n      <button onClick={()=>setDark(!dark)} style={{padding:'12px 30px',border:'none',borderRadius:'30px',background:dark?'#f0db4f':'#1a1a2e',color:dark?'#1a1a2e':'white',fontSize:'16px',cursor:'pointer',marginTop:'20px'}}>\n        Switch to {dark?'Light':'Dark'} Mode\n      </button>\n    </div>\n  );\n};\n\nReactDOM.createRoot(document.getElementById('root')).render(<DarkModeToggle/>);\n</script>\n</body>\n</html>`, lang: "html" }
    ],
    projects: [
      { id: 1, title: "Weather Dashboard", desc: "Build a weather dashboard with React components, mock data, and dynamic UI updates.", difficulty: "Intermediate", code: `<!DOCTYPE html>\n<html>\n<head>\n<script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a237e,#0277bd);min-height:100vh;padding:30px;color:white}</style>\n</head>\n<body>\n<div id="root"></div>\n<script type="text/babel">\nconst {useState} = React;\n\nconst weatherData = {\n  'New York': {temp:22,feels:19,humidity:65,wind:15,desc:'Partly Cloudy',icon:'⛅',high:25,low:18},\n  'London': {temp:15,feels:12,humidity:80,wind:20,desc:'Rainy',icon:'🌧',high:17,low:11},\n  'Tokyo': {temp:28,feels:30,humidity:75,wind:10,desc:'Sunny',icon:'☀️',high:30,low:22},\n  'Paris': {temp:18,feels:16,humidity:70,wind:12,desc:'Cloudy',icon:'☁️',high:20,low:14},\n  'Dubai': {temp:38,feels:42,humidity:40,wind:8,desc:'Hot & Sunny',icon:'🌤',high:40,low:30},\n};\n\nconst forecast = [\n  {day:'Mon',icon:'☀️',high:25,low:18},\n  {day:'Tue',icon:'⛅',high:22,low:15},\n  {day:'Wed',icon:'🌧',high:18,low:12},\n  {day:'Thu',icon:'☀️',high:26,low:17},\n  {day:'Fri',icon:'⛅',high:23,low:16},\n];\n\nconst Card = ({label,value,icon}) => (\n  <div style={{background:'rgba(255,255,255,0.15)',borderRadius:'12px',padding:'15px',textAlign:'center'}}>\n    <div style={{fontSize:'1.5em'}}>{icon}</div>\n    <div style={{fontSize:'1.4em',fontWeight:'bold',margin:'5px 0'}}>{value}</div>\n    <div style={{opacity:0.8,fontSize:'0.85em'}}>{label}</div>\n  </div>\n);\n\nconst App = () => {\n  const [city, setCity] = useState('New York');\n  const w = weatherData[city];\n  \n  return (\n    <div style={{maxWidth:'600px',margin:'0 auto'}}>\n      <h1 style={{textAlign:'center',marginBottom:'25px',fontSize:'2em'}}>🌤 Weather Dashboard</h1>\n      \n      <div style={{display:'flex',gap:'10px',marginBottom:'25px',flexWrap:'wrap'}}>\n        {Object.keys(weatherData).map(c=>\n          <button key={c} onClick={()=>setCity(c)}\n            style={{padding:'8px 16px',border:'2px solid rgba(255,255,255,0.5)',borderRadius:'20px',background:c===city?'rgba(255,255,255,0.3)':'transparent',color:'white',cursor:'pointer',fontWeight:c===city?'bold':'normal'}}>\n            {c}\n          </button>\n        )}\n      </div>\n      \n      <div style={{background:'rgba(255,255,255,0.2)',borderRadius:'20px',padding:'30px',marginBottom:'20px',textAlign:'center'}}>\n        <div style={{fontSize:'4em',marginBottom:'10px'}}>{w.icon}</div>\n        <h2 style={{fontSize:'1.5em',marginBottom:'5px'}}>{city}</h2>\n        <div style={{fontSize:'4em',fontWeight:'bold'}}>{w.temp}°C</div>\n        <div style={{opacity:0.9}}>{w.desc} · Feels like {w.feels}°C</div>\n      </div>\n      \n      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>\n        <Card label="Humidity" value={w.humidity+'%'} icon="💧"/>\n        <Card label="Wind" value={w.wind+' km/h'} icon="💨"/>\n        <Card label="High/Low" value={w.high+'°/'+w.low+'°'} icon="🌡"/>\n      </div>\n      \n      <div style={{background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'20px'}}>\n        <h3 style={{marginBottom:'15px'}}>5-Day Forecast</h3>\n        <div style={{display:'flex',justifyContent:'space-around'}}>\n          {forecast.map(f=>\n            <div key={f.day} style={{textAlign:'center'}}>\n              <div style={{opacity:0.8,marginBottom:'5px'}}>{f.day}</div>\n              <div style={{fontSize:'1.5em'}}>{f.icon}</div>\n              <div style={{fontWeight:'bold'}}>{f.high}°</div>\n              <div style={{opacity:0.7,fontSize:'0.9em'}}>{f.low}°</div>\n            </div>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n};\n\nReactDOM.createRoot(document.getElementById('root')).render(<App/>);\n</script>\n</body>\n</html>`, lang: "html" }
    ]
  },
  sql: {
    id: "sql", label: "SQL", icon: "🗃", color: "#e48e00",
    desc: "Query and manage databases",
    lessons: [
      { id: 1, title: "SQL Basics", theory: `SQL (Structured Query Language) is the standard language for relational database management systems. SQL statements are used to perform tasks such as update data on a database, or retrieve data from a database.\n\nCommon SQL commands:\n• SELECT – extracts data\n• INSERT – inserts new data\n• UPDATE – updates data\n• DELETE – deletes data\n• CREATE TABLE – creates a new table`, code: `-- Basic SELECT queries\nSELECT * FROM employees;\n\nSELECT first_name, last_name, salary\nFROM employees\nWHERE salary > 50000;\n\n-- ORDER and LIMIT\nSELECT first_name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;\n\n-- Aggregation\nSELECT department, \n       COUNT(*) as count,\n       AVG(salary) as avg_salary,\n       MAX(salary) as max_salary\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 2;`, lang: "sql" },
    ],
    exercises: [
      { id: 1, title: "Write a SELECT Query", desc: "Write a SQL query to find all customers from 'USA' with orders over $100, ordered by amount descending.", starter: `-- Write your query here\nSELECT \nFROM customers\nJOIN orders ON\nWHERE\nORDER BY`, solution: `SELECT c.customer_name, c.email, o.amount\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE c.country = 'USA'\n  AND o.amount > 100\nORDER BY o.amount DESC;`, lang: "sql" }
    ],
    projects: [
      { id: 1, title: "E-commerce Database Schema", desc: "Design and create a complete e-commerce database with products, users, orders tables.", difficulty: "Intermediate", code: `-- E-Commerce Database Schema\n\n-- Users table\nCREATE TABLE users (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  password_hash VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Categories\nCREATE TABLE categories (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  parent_id INT,\n  FOREIGN KEY (parent_id) REFERENCES categories(id)\n);\n\n-- Products\nCREATE TABLE products (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(200) NOT NULL,\n  description TEXT,\n  price DECIMAL(10,2) NOT NULL,\n  stock_qty INT DEFAULT 0,\n  category_id INT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (category_id) REFERENCES categories(id)\n);\n\n-- Orders\nCREATE TABLE orders (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  user_id INT NOT NULL,\n  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',\n  total DECIMAL(10,2),\n  shipping_address TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\n-- Order Items\nCREATE TABLE order_items (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  order_id INT NOT NULL,\n  product_id INT NOT NULL,\n  quantity INT NOT NULL,\n  unit_price DECIMAL(10,2) NOT NULL,\n  FOREIGN KEY (order_id) REFERENCES orders(id),\n  FOREIGN KEY (product_id) REFERENCES products(id)\n);\n\n-- Sample queries\n-- Get top 5 best selling products\nSELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.unit_price) as revenue\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nJOIN orders o ON oi.order_id = o.id\nWHERE o.status != 'cancelled'\nGROUP BY p.id, p.name\nORDER BY total_sold DESC\nLIMIT 5;`, lang: "sql" }
    ]
  }
};

const PYTHON_SIMULATE = (code) => {
  const lines = [];
  const fakeExec = (c) => {
    const prints = [...c.matchAll(/print\(([^)]+)\)/g)];
    prints.forEach(m => {
      let val = m[1].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        lines.push(val.slice(1, -1));
      } else if (val.startsWith('f"') || val.startsWith("f'")) {
        lines.push(val.slice(2, -1).replace(/\{[^}]+\}/g, '...'));
      } else {
        lines.push(`[output of ${val}]`);
      }
    });
  };
  return "Python simulation:\n" + code.split('\n').filter(l=>l.trim().startsWith('print')).map(l=>l.trim()).join('\n') + "\n\n(Run in a Python environment for full output)";
};

export default function LMSPortal() {
  const [activeCourse, setActiveCourse] = useState("html");
  const [activeTab, setActiveTab] = useState("lessons");
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [editorCode, setEditorCode] = useState("");
  const [preview, setPreview] = useState("");
  const [exerciseCode, setExerciseCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [activeExercise, setActiveExercise] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const [projectCode, setProjectCode] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your AI Tutor. Ask me anything about programming — concepts, debugging help, or code explanations!" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("course");
  const iframeRef = useRef(null);
  const projectIframeRef = useRef(null);
  const aiEndRef = useRef(null);

  const course = COURSES[activeCourse];
  const lesson = course.lessons.find(l => l.id === activeLessonId) || course.lessons[0];
  const exercise = course.exercises[activeExercise];
  const project = course.projects[activeProject];

  useEffect(() => {
    setEditorCode(lesson.code);
    setPreview(lesson.code);
  }, [activeLessonId, activeCourse]);

  useEffect(() => {
    if (exercise) {
      setExerciseCode(exercise.starter);
      setShowSolution(false);
    }
  }, [activeExercise, activeCourse]);

  useEffect(() => {
    if (project) {
      setProjectCode(project.code);
    }
  }, [activeProject, activeCourse]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const runCode = useCallback(() => {
    setPreview(editorCode);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = editorCode;
    }
  }, [editorCode]);

  const runProject = useCallback(() => {
    if (projectIframeRef.current) {
      projectIframeRef.current.srcdoc = projectCode;
    }
  }, [projectCode]);

  useEffect(() => {
    if (iframeRef.current && lesson.lang === "html") {
      iframeRef.current.srcdoc = lesson.code;
    }
  }, [lesson]);

  useEffect(() => {
    if (projectIframeRef.current && project?.lang === "html") {
      projectIframeRef.current.srcdoc = project.code;
    }
  }, [project]);

  const markComplete = () => {
    setCompletedLessons(prev => ({ ...prev, [`${activeCourse}-${activeLessonId}`]: true }));
  };

  const totalLessons = Object.values(COURSES).reduce((a, c) => a + c.lessons.length, 0);
  const totalCompleted = Object.keys(completedLessons).length;
  const progressPct = Math.round((totalCompleted / totalLessons) * 100);

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setAiInput("");
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert programming tutor in an LMS portal similar to W3Schools. The student is currently studying ${course.label}. 
Give clear, concise, beginner-friendly explanations with short code examples when helpful. 
Format code with backticks. Keep responses under 300 words. Be encouraging and supportive.`,
          messages: [...aiMessages.filter(m => m.role !== "assistant" || aiMessages.indexOf(m) > 0), { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again!";
      setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error. Please check your internet and try again." }]);
    }
    setAiLoading(false);
  };

  const s = {
    app: { display:"flex", flexDirection:"column", height:"100vh", background:"#0f0f1a", color:"#e8e8f0", fontFamily:"'JetBrains Mono', 'Fira Code', 'Consolas', monospace", overflow:"hidden" },
    header: { display:"flex", alignItems:"center", gap:"16px", padding:"0 20px", height:"52px", background:"#13131f", borderBottom:"1px solid #2a2a3e", flexShrink:0, zIndex:10 },
    logo: { fontSize:"18px", fontWeight:"700", color:"#7ee8a2", letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:"8px" },
    navBtn: (active) => ({ background:active?"#1e1e30":"transparent", border:"none", color:active?"#7ee8a2":"#888", cursor:"pointer", padding:"6px 14px", borderRadius:"6px", fontSize:"12px", fontWeight:"500", letterSpacing:"0.5px", textTransform:"uppercase" }),
    progress: { marginLeft:"auto", display:"flex", alignItems:"center", gap:"10px", fontSize:"12px", color:"#888" },
    progressBar: { width:"100px", height:"6px", background:"#2a2a3e", borderRadius:"3px", overflow:"hidden" },
    progressFill: { height:"100%", background:"linear-gradient(90deg,#7ee8a2,#43c6ac)", borderRadius:"3px", transition:"width 0.5s", width:`${progressPct}%` },
    body: { display:"flex", flex:1, overflow:"hidden" },
    sidebar: { width:sidebarOpen?220:0, background:"#13131f", borderRight:"1px solid #2a2a3e", overflow:"hidden", transition:"width 0.2s", flexShrink:0, display:"flex", flexDirection:"column" },
    sidebarInner: { width:220, display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" },
    sidebarSection: { padding:"16px 12px 8px", fontSize:"10px", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:"600" },
    courseBtn: (active) => ({ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", margin:"1px 6px", borderRadius:"8px", cursor:"pointer", background:active?"#1e2a3a":"transparent", border:"none", color:active?"#7ee8a2":"#888", fontSize:"13px", fontWeight:active?"600":"400", width:"calc(100% - 12px)", textAlign:"left", transition:"all 0.15s" }),
    courseIcon: (color) => ({ fontSize:"14px", width:"22px", height:"22px", borderRadius:"5px", display:"flex", alignItems:"center", justifyContent:"center", background:`${color}22`, color }),
    main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    tabBar: { display:"flex", gap:"2px", padding:"8px 16px", background:"#13131f", borderBottom:"1px solid #2a2a3e", alignItems:"center" },
    tab: (active) => ({ padding:"6px 14px", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"12px", fontWeight:"500", background:active?"#1e2a3a":"transparent", color:active?"#7ee8a2":"#666", letterSpacing:"0.3px", textTransform:"uppercase" }),
    content: { flex:1, overflow:"auto", display:"flex", gap:0 },
    lessonList: { width:"220px", borderRight:"1px solid #2a2a3e", overflow:"auto", flexShrink:0, background:"#111120" },
    lessonItem: (active, done) => ({ padding:"10px 14px", cursor:"pointer", background:active?"#1e2a3a":"transparent", borderLeft:`3px solid ${active?"#7ee8a2":done?"#43c6ac22":"transparent"}`, color:active?"#7ee8a2":done?"#55aa77":"#888", fontSize:"13px", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.15s" }),
    lessonContent: { flex:1, padding:"24px 28px", overflow:"auto", maxWidth:"800px" },
    theory: { background:"#161626", border:"1px solid #2a2a3e", borderRadius:"10px", padding:"20px", marginBottom:"20px", lineHeight:"1.8", fontSize:"14px", color:"#ccd0e0", whiteSpace:"pre-wrap" },
    codeBlock: { background:"#0d0d18", border:"1px solid #2a2a3e", borderRadius:"10px", overflow:"hidden", marginBottom:"20px" },
    codeHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 14px", background:"#161626", borderBottom:"1px solid #2a2a3e" },
    codeArea: { padding:"16px", fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", color:"#abb2bf", lineHeight:"1.7", margin:0, overflow:"auto", maxHeight:"280px" },
    editorPane: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    previewPane: { width:"50%", borderLeft:"1px solid #2a2a3e", display:"flex", flexDirection:"column", overflow:"hidden" },
    paneHeader: { padding:"8px 14px", background:"#13131f", borderBottom:"1px solid #2a2a3e", fontSize:"11px", color:"#555", letterSpacing:"1px", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"space-between" },
    editor: { flex:1, background:"#0d0d18", color:"#abb2bf", border:"none", outline:"none", padding:"16px", fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", lineHeight:"1.7", resize:"none" },
    runBtn: { background:"#7ee8a2", color:"#0d0d18", border:"none", padding:"5px 14px", borderRadius:"5px", cursor:"pointer", fontSize:"12px", fontWeight:"700", letterSpacing:"0.5px" },
    iframe: { flex:1, border:"none", background:"white" },
    practiceWrap: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"24px 28px", gap:"16px", overflow:"auto" },
    exCard: (active) => ({ padding:"14px 16px", borderRadius:"10px", border:`1px solid ${active?"#7ee8a2":"#2a2a3e"}`, cursor:"pointer", background:active?"#1e2a3a":"#161626", marginBottom:"8px" }),
    btn: (color="#7ee8a2") => ({ background:color, color:"#0d0d18", border:"none", padding:"8px 18px", borderRadius:"7px", cursor:"pointer", fontSize:"12px", fontWeight:"700", letterSpacing:"0.5px" }),
    btnOutline: { background:"transparent", color:"#888", border:"1px solid #333", padding:"8px 18px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" },
    aiWrap: { display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" },
    aiMsgs: { flex:1, overflow:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" },
    aiBubble: (role) => ({ maxWidth:"80%", padding:"10px 14px", borderRadius:"10px", fontSize:"13px", lineHeight:"1.6", background:role==="user"?"#1e2a3a":"#161626", color:role==="user"?"#c0e4ff":"#ccd0e0", alignSelf:role==="user"?"flex-end":"flex-start", border:`1px solid ${role==="user"?"#2a3a4e":"#2a2a3e"}`, whiteSpace:"pre-wrap" }),
    aiInput: { display:"flex", gap:"8px", padding:"12px 16px", borderTop:"1px solid #2a2a3e", background:"#13131f" },
    projectGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:"16px", padding:"24px 28px" },
    projectCard: (active) => ({ background:"#161626", border:`1px solid ${active?"#7ee8a2":"#2a2a3e"}`, borderRadius:"12px", padding:"18px", cursor:"pointer", transition:"all 0.15s" }),
  };

  const renderDashboard = () => (
    <div style={{ padding:"32px", overflow:"auto", flex:1 }}>
      <div style={{ marginBottom:"32px" }}>
        <h1 style={{ fontSize:"28px", fontWeight:"700", color:"#7ee8a2", marginBottom:"8px" }}>Welcome back! 👋</h1>
        <p style={{ color:"#666", fontSize:"14px" }}>Continue your learning journey. {totalCompleted} of {totalLessons} lessons completed.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"32px" }}>
        {[
          { label:"Lessons Done", value:totalCompleted, icon:"📚", color:"#7ee8a2" },
          { label:"Courses", value:Object.keys(COURSES).length, icon:"🎓", color:"#43c6ac" },
          { label:"Projects", value:Object.values(COURSES).reduce((a,c)=>a+c.projects.length,0), icon:"🚀", color:"#f0db4f" },
          { label:"Progress", value:progressPct+"%", icon:"📈", color:"#ff6b6b" },
        ].map(stat => (
          <div key={stat.label} style={{ background:"#13131f", border:"1px solid #2a2a3e", borderRadius:"12px", padding:"18px" }}>
            <div style={{ fontSize:"24px", marginBottom:"8px" }}>{stat.icon}</div>
            <div style={{ fontSize:"28px", fontWeight:"700", color:stat.color }}>{stat.value}</div>
            <div style={{ fontSize:"12px", color:"#666", marginTop:"4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize:"16px", fontWeight:"600", color:"#888", marginBottom:"16px", letterSpacing:"1px", textTransform:"uppercase" }}>All Courses</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
        {Object.values(COURSES).map(c => (
          <div key={c.id} onClick={() => { setActiveCourse(c.id); setActiveView("course"); setActiveTab("lessons"); setActiveLessonId(1); }}
            style={{ background:"#13131f", border:"1px solid #2a2a3e", borderRadius:"12px", padding:"20px", cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="#7ee8a2"}
            onMouseLeave={e => e.currentTarget.style.borderColor="#2a2a3e"}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
              <div style={{ ...s.courseIcon(c.color), width:"32px", height:"32px", borderRadius:"8px", fontSize:"18px" }}>{c.icon}</div>
              <div>
                <div style={{ fontWeight:"700", color:"#e8e8f0", fontSize:"15px" }}>{c.label}</div>
                <div style={{ fontSize:"11px", color:"#555" }}>{c.lessons.length} lessons</div>
              </div>
            </div>
            <div style={{ fontSize:"12px", color:"#666" }}>{c.desc}</div>
            <div style={{ marginTop:"12px", height:"4px", background:"#2a2a3e", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"100%", background:`linear-gradient(90deg,${c.color},${c.color}88)`, width:`${c.lessons.filter(l=>completedLessons[`${c.id}-${l.id}`]).length/c.lessons.length*100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLessons = () => (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <div style={s.lessonList}>
        <div style={{ padding:"12px 14px 6px", fontSize:"10px", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase" }}>Lessons</div>
        {course.lessons.map(l => {
          const done = completedLessons[`${activeCourse}-${l.id}`];
          return (
            <div key={l.id} style={s.lessonItem(l.id === activeLessonId, done)} onClick={() => setActiveLessonId(l.id)}>
              <span style={{ fontSize:"10px" }}>{done ? "✓" : l.id === activeLessonId ? "▶" : "○"}</span>
              <span style={{ fontSize:"12px" }}>{l.title}</span>
            </div>
          );
        })}
      </div>
      <div style={s.lessonContent}>
        <h2 style={{ fontSize:"20px", fontWeight:"700", color:"#e8e8f0", marginBottom:"6px" }}>{lesson.title}</h2>
        <div style={{ fontSize:"11px", color:"#555", marginBottom:"20px", letterSpacing:"0.5px" }}>{course.label} · Lesson {lesson.id} of {course.lessons.length}</div>
        <div style={s.theory}>{lesson.theory}</div>
        <div style={{ fontWeight:"600", color:"#7ee8a2", fontSize:"13px", marginBottom:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
          <span>◈</span> Code Example
        </div>
        <div style={s.codeBlock}>
          <div style={s.codeHeader}>
            <span style={{ fontSize:"11px", color:"#555" }}>{lesson.lang === "python" ? "Python" : lesson.lang === "sql" ? "SQL" : "HTML/CSS/JS"}</span>
            <button style={s.btn()} onClick={() => { setEditorCode(lesson.code); setActiveTab("editor"); }}>Try it →</button>
          </div>
          <pre style={s.codeArea}>{lesson.code}</pre>
        </div>
        <div style={{ display:"flex", gap:"10px", marginTop:"8px" }}>
          {lesson.id < course.lessons.length && (
            <button style={s.btn()} onClick={() => setActiveLessonId(l => Math.min(l + 1, course.lessons.length))}>Next Lesson →</button>
          )}
          <button style={{ ...s.btn("#43c6ac") }} onClick={markComplete}>✓ Mark Complete</button>
          <button style={s.btnOutline} onClick={() => setActiveTab("practice")}>Try Exercise</button>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <div style={s.editorPane}>
        <div style={s.paneHeader}>
          <span>Editor</span>
          <button style={s.runBtn} onClick={runCode}>▶ Run</button>
        </div>
        <textarea style={s.editor} value={editorCode} onChange={e => setEditorCode(e.target.value)} spellCheck={false} />
      </div>
      <div style={s.previewPane}>
        <div style={s.paneHeader}><span>Preview / Output</span></div>
        {lesson.lang === "python" ? (
          <pre style={{ flex:1, padding:"16px", background:"#0d0d18", color:"#7ee8a2", fontFamily:"monospace", fontSize:"13px", overflow:"auto", margin:0, whiteSpace:"pre-wrap" }}>
            {PYTHON_SIMULATE(editorCode)}
          </pre>
        ) : lesson.lang === "sql" ? (
          <pre style={{ flex:1, padding:"16px", background:"#0d0d18", color:"#e48e00", fontFamily:"monospace", fontSize:"13px", overflow:"auto", margin:0, whiteSpace:"pre-wrap" }}>
            {editorCode}
            {"\n\n"}[SQL Preview: Connect to a database to run queries]
          </pre>
        ) : (
          <iframe ref={iframeRef} style={s.iframe} title="preview" srcDoc={lesson.code} sandbox="allow-scripts allow-forms" />
        )}
      </div>
    </div>
  );

  const renderPractice = () => (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <div style={{ width:"240px", borderRight:"1px solid #2a2a3e", overflow:"auto", background:"#111120", padding:"12px" }}>
        <div style={{ fontSize:"10px", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px" }}>Exercises</div>
        {course.exercises.map((ex, i) => (
          <div key={ex.id} style={s.exCard(i === activeExercise)} onClick={() => setActiveExercise(i)}>
            <div style={{ fontSize:"12px", fontWeight:"600", color:i===activeExercise?"#7ee8a2":"#888" }}>{ex.title}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #2a2a3e", background:"#13131f" }}>
          <h3 style={{ color:"#e8e8f0", fontSize:"15px", fontWeight:"600", marginBottom:"6px" }}>{exercise?.title}</h3>
          <p style={{ color:"#888", fontSize:"13px", lineHeight:"1.6" }}>{exercise?.desc}</p>
        </div>
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", borderRight:"1px solid #2a2a3e" }}>
            <div style={s.paneHeader}>
              <span>Your Code</span>
              <div style={{ display:"flex", gap:"8px" }}>
                <button style={s.runBtn} onClick={() => { if(exerciseIframeRef?.current) exerciseIframeRef.current.srcdoc = exerciseCode; }}>▶ Run</button>
                <button style={{ ...s.btnOutline, padding:"5px 12px", fontSize:"11px" }} onClick={() => setShowSolution(!showSolution)}>
                  {showSolution ? "Hide" : "Show"} Solution
                </button>
              </div>
            </div>
            <textarea style={{ ...s.editor, flex:1 }} value={showSolution ? exercise?.solution : exerciseCode} onChange={e => !showSolution && setExerciseCode(e.target.value)} readOnly={showSolution} spellCheck={false} />
          </div>
          <div style={{ width:"45%", display:"flex", flexDirection:"column" }}>
            <div style={s.paneHeader}><span>Output</span></div>
            <ExercisePreview code={showSolution ? exercise?.solution : exerciseCode} lang={exercise?.lang} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <div style={{ width:"260px", borderRight:"1px solid #2a2a3e", overflow:"auto", background:"#111120", padding:"14px" }}>
        <div style={{ fontSize:"10px", color:"#555", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"10px" }}>Live Projects</div>
        {course.projects.map((p, i) => (
          <div key={p.id} style={s.projectCard(i === activeProject)} onClick={() => setActiveProject(i)}
            onMouseEnter={e => { if(i!==activeProject) e.currentTarget.style.borderColor="#444"; }}
            onMouseLeave={e => { if(i!==activeProject) e.currentTarget.style.borderColor="#2a2a3e"; }}>
            <div style={{ fontSize:"13px", fontWeight:"600", color:i===activeProject?"#7ee8a2":"#ccc", marginBottom:"5px" }}>{p.title}</div>
            <div style={{ fontSize:"11px", color:"#555", lineHeight:"1.5" }}>{p.desc}</div>
            <div style={{ marginTop:"8px" }}>
              <span style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"10px", background:p.difficulty==="Beginner"?"#51cf6622":"#f0db4f22", color:p.difficulty==="Beginner"?"#51cf66":"#f0db4f" }}>{p.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ ...s.paneHeader, padding:"10px 16px" }}>
          <span style={{ color:"#888" }}>{project?.title}</span>
          <button style={s.runBtn} onClick={runProject}>▶ Run Project</button>
        </div>
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          <textarea style={{ ...s.editor, width:"50%", borderRight:"1px solid #2a2a3e" }} value={projectCode} onChange={e => setProjectCode(e.target.value)} spellCheck={false} />
          <iframe ref={projectIframeRef} style={{ ...s.iframe, width:"50%" }} title="project-preview" srcDoc={project?.code} sandbox="allow-scripts allow-forms" />
        </div>
      </div>
    </div>
  );

  const renderAITutor = () => (
    <div style={s.aiWrap}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #2a2a3e", background:"#13131f", display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#7ee8a222", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>🤖</div>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"600", color:"#7ee8a2" }}>AI Tutor</div>
          <div style={{ fontSize:"11px", color:"#555" }}>Powered by Claude · {course.label} Expert</div>
        </div>
      </div>
      <div style={s.aiMsgs}>
        {aiMessages.map((m, i) => (
          <div key={i} style={s.aiBubble(m.role)}>
            {m.role === "assistant" && <div style={{ fontSize:"10px", color:"#7ee8a2", marginBottom:"4px" }}>🤖 AI Tutor</div>}
            {m.content}
          </div>
        ))}
        {aiLoading && (
          <div style={s.aiBubble("assistant")}>
            <div style={{ fontSize:"10px", color:"#7ee8a2", marginBottom:"4px" }}>🤖 AI Tutor</div>
            <span style={{ color:"#555" }}>Thinking...</span>
          </div>
        )}
        <div ref={aiEndRef} />
      </div>
      <div style={s.aiInput}>
        <input style={{ flex:1, background:"#1a1a2e", border:"1px solid #2a2a3e", borderRadius:"8px", padding:"8px 12px", color:"#e8e8f0", fontSize:"13px", outline:"none", fontFamily:"inherit" }}
          value={aiInput} onChange={e => setAiInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendAI()}
          placeholder={`Ask about ${course.label}...`} />
        <button style={s.btn()} onClick={sendAI} disabled={aiLoading}>Send</button>
      </div>
    </div>
  );

  const tabs = [
    { id:"lessons", label:"📖 Lessons" },
    { id:"editor", label:"💻 Editor" },
    { id:"practice", label:"✏️ Practice" },
    { id:"projects", label:"🚀 Projects" },
    { id:"ai", label:"🤖 AI Tutor" },
  ];

  return (
    <div style={s.app}>
      <header style={s.header}>
        <button style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:"16px", padding:"4px" }} onClick={() => setSidebarOpen(o => !o)}>☰</button>
        <div style={s.logo}>
          <span style={{ fontSize:"22px" }}>⟨/⟩</span> LearnCode
        </div>
        <div style={{ display:"flex", gap:"4px", marginLeft:"24px" }}>
          <button style={s.navBtn(activeView==="dashboard")} onClick={() => setActiveView("dashboard")}>Dashboard</button>
          <button style={s.navBtn(activeView==="course")} onClick={() => setActiveView("course")}>Courses</button>
        </div>
        <div style={s.progress}>
          <span>{progressPct}% complete</span>
          <div style={s.progressBar}><div style={s.progressFill}></div></div>
          <span style={{ color:"#7ee8a2", fontWeight:"600" }}>{totalCompleted}/{totalLessons}</span>
        </div>
      </header>

      <div style={s.body}>
        {activeView === "course" && (
          <div style={s.sidebar}>
            <div style={s.sidebarInner}>
              <div style={s.sidebarSection}>Courses</div>
              {Object.values(COURSES).map(c => (
                <button key={c.id} style={s.courseBtn(activeCourse === c.id)}
                  onClick={() => { setActiveCourse(c.id); setActiveLessonId(1); setActiveTab("lessons"); }}>
                  <div style={s.courseIcon(c.color)}>{c.icon}</div>
                  <span>{c.label}</span>
                  {Object.keys(completedLessons).filter(k=>k.startsWith(c.id)).length > 0 && (
                    <span style={{ marginLeft:"auto", fontSize:"10px", color:"#43c6ac" }}>
                      {Object.keys(completedLessons).filter(k=>k.startsWith(c.id)).length}/{c.lessons.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={s.main}>
          {activeView === "dashboard" ? renderDashboard() : (
            <>
              <div style={s.tabBar}>
                <div style={{ ...s.courseIcon(course.color), marginRight:"8px", fontSize:"16px" }}>{course.icon}</div>
                <span style={{ color:"#e8e8f0", fontSize:"14px", fontWeight:"600", marginRight:"16px" }}>{course.label}</span>
                {tabs.map(t => (
                  <button key={t.id} style={s.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
                ))}
              </div>
              <div style={s.content}>
                {activeTab === "lessons" && renderLessons()}
                {activeTab === "editor" && renderEditor()}
                {activeTab === "practice" && renderPractice()}
                {activeTab === "projects" && renderProjects()}
                {activeTab === "ai" && renderAITutor()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExercisePreview({ code, lang }) {
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current && lang === "html") {
      iframeRef.current.srcdoc = code || "";
    }
  }, [code, lang]);

  if (lang === "python" || lang === "sql") {
    return (
      <pre style={{ flex:1, padding:"16px", background:"#0d0d18", color:"#7ee8a2", fontFamily:"monospace", fontSize:"13px", overflow:"auto", margin:0, whiteSpace:"pre-wrap" }}>
        {code}{"\n\n"}[Run in a {lang} environment for output]
      </pre>
    );
  }
  return <iframe ref={iframeRef} style={{ flex:1, border:"none", background:"white" }} title="exercise" srcDoc={code} sandbox="allow-scripts allow-forms" />;
}
