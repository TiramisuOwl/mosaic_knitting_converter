import re

#regex patterns
#rows and stitches with row number and stitch counts
row = re.compile(r"((row(s)?)( )?\d+(:)?)|((\d+((st |nd |rd |th )?(and |-|to )?))*(row(s)?))( )?(:)?", re.I)
knit = re.compile(r"(k|kn|knit)\s*(\d+)",re.I)
slip = re.compile(r"(sl|slst|sl st|slip|slipst|slip st|slipstitch|slip stitch)( )?\d+", re.I)
side_right = re.compile(r"\(?RS\)?", re.I)
side_wrong = re.compile(r"\(?WS\)?", re.I)
#determines chart
color = re.compile(r"(with|use|using)\s+(?:color\s+)?(\w+)", re.I)
col_A = re.compile(r"a|1|dominant", re.I)
#to deal with the rest of the written pattern
whitespace = re.compile(r"\s")
language = re.compile(r"\w|\.|\,", re.I)
unknown_stitch = re.compile(r"[A-Za-z]+\d*", re.I)
invalid_knit = re.compile(r"(k|kn|knit)\b",re.I)

def row_match(curr_row_var):
    """Processes row information (number, truncates knit patt)"""
    global knit_patt
    global symbol_chart_stack
    global curr_row_num

    if match := re.search(r"\d+", curr_row_var.group()):
        curr_row_num = int(match.group())
        knit_patt = knit_patt[curr_row_var.end():]
    else:
        knit_patt = ""
        raise ValueError("ERROR: No row number found, please check the pattern and try again")
    symbol_chart_stack.append(curr_row_num)

def side_match(curr_side_var, side_var):
    global knit_patt
    global symbol_chart_stack
    if side_var:
        knit_patt = knit_patt[curr_side_var.end():]
    else:
        symbol_chart_stack.pop()
        if next_row := row.search(knit_patt):
            knit_patt = knit_patt[next_row.start():]
        else:
            knit_patt = ""

def color_match(curr_color_var):
    """Processes color information (current color, truncates knit_patt)"""
    global knit_patt
    global currcolor
    global currcolor2
    knit_patt = knit_patt[curr_color_var.end():]
    if col_A.search(curr_color_var.group()):
        currcolor = color_A
        currcolor2 = color_B
    else:
        currcolor = color_B
        currcolor2 = color_A

def knit_match(curr_stitch_var):
    """Process knit stitch information (color, num stitches, update stack, truncate knit_patt)"""
    global knit_patt
    global symbol_chart_stack
    if knit_num := re.search(r"\d+", curr_stitch_var.group()):
        curr_knit_num = int(knit_num.group())
        for i in range(curr_knit_num):
            symbol_chart_stack.append(currcolor)
            symbol_chart_stack.append(" | ")
        knit_patt = knit_patt[curr_stitch_var.end():]
    else:
        raise ValueError("ERROR: No stitch count found for this stitch. Please check the pattern and try again." +
            "\nROW NUMBER: " + str(curr_row_num) +
            "\nSTICH: " + curr_stitch_var.group())
        knit_patt = ""
def slip_match(curr_stitch_var):
    """Process slip stitch information (color, num stitches, update stack, truncate knit_patt)"""
    global knit_patt
    global symbol_chart_stack
    if slip_num := re.search(r"\d+", curr_stitch_var.group()):
        curr_slip_num = int(slip_num.group())
        for i in range(curr_slip_num):
            symbol_chart_stack.append(currcolor2)
            symbol_chart_stack.append(" | ")
        knit_patt = knit_patt[curr_stitch_var.end():]
    else:
        raise ValueError("ERROR: No stitch count found for this stitch. Please check the pattern and try again." +
            "\nROW NUMBER: " + str(curr_row_num) +
            "\nSTICH: " + curr_stitch_var.group())
        knit_patt = ""

def whitespace_language_match(curr_char):
    """Process and ignore"""
    global knit_patt
    knit_patt = knit_patt[curr_char.end():]


def parse_pattern(instructions):
    global knit_patt, knit_patt_original
    global symbol_chart_stack, color_A, color_B
    global currcolor, currcolor2, curr_row_num

    knit_patt = instructions
    knit_patt_original = instructions
    symbol_chart_stack = []
    color_A = "#"
    color_B = " "
    currcolor = color_A
    currcolor2 = color_B
    curr_row_num = 1

    expect_row, expect_side, expect_color, expect_stitch = True, False, False, False
    expected_row = 1
    while knit_patt:
        if curr_row := row.match(knit_patt):
            if not expect_row:
                raise ValueError("ERROR: Unexpected Row Given. Please check the pattern and try again.")
            expect_row, expect_side, expect_color, expect_stitch = False, True, True, True
            #TODO: change later to find all for repeating rows
            row_match(curr_row)
            if curr_row_num != expected_row:
                raise ValueError(f"ERROR: Row numbers are not sequential. Expected row {expected_row} but found row {curr_row_num}. Please check the pattern and try again.")
            expected_row += 1
        #next step is to find the side (optional)
        elif curr_side := side_wrong.match(knit_patt):
            if not expect_side:
                raise ValueError(f"ERROR: Unexpected Side Given in row {curr_row_num}. Please check the pattern and try again.")
            expect_side, expect_color = False, True
            side_match(curr_side, False)
        elif curr_side := side_right.match(knit_patt):
            if not expect_side:
                raise ValueError(f"ERROR: Unexpected Side Given in row {curr_row_num}. Please check the pattern and try again.")
            expect_side, expect_color = False, True
            side_match(curr_side, True)
        #next step is to find color info (optional)
        elif curr_color := color.match(knit_patt):
            if not expect_color:
                raise ValueError(f"ERROR: Unexpected Color Given in row {curr_row_num}. Please check the pattern and try again.")
            expect_color, expect_stitch = False, True
            color_match(curr_color)
        #next find our stitches (similar to row, but we do this in order)
        elif curr_stitch := knit.match(knit_patt):
            if not expect_stitch:
                raise ValueError(f"ERROR: Unexpected Stitch Given in row {curr_row_num}. Please check the pattern and try again.")
            expect_stitch, expect_row = True, True
            knit_match(curr_stitch)
        elif curr_stitch := slip.match(knit_patt):
            if not expect_stitch:
                raise ValueError(f"ERROR: Unexpected Stitch Given in row {curr_row_num}. Please check the pattern and try again.")
            expect_stitch, expect_row = True, True
            slip_match(curr_stitch)
        elif expect_stitch and not expect_color and invalid_knit.match(knit_patt):
            raise ValueError(f"ERROR: Missing stitch count after knit in row {curr_row_num}.")
        elif expect_stitch and not expect_color and (bad_token := unknown_stitch.match(knit_patt)):
            raise ValueError(f"ERROR: Unsupported stitch instruction: {bad_token.group()}")
        elif curr_char := whitespace.match(knit_patt):
            whitespace_language_match(curr_char)
        elif curr_char := language.match(knit_patt):
            whitespace_language_match(curr_char)
        else:
            print("No more matches founds. Printing final chart")
            knit_patt = ""
            break

    row_length = 0
    symbol_chart = ""
    symbol_chart_stack.reverse()
    for i in range(len(symbol_chart_stack)):
        if type(symbol_chart_stack[i])==int:
            symbol_chart += "  " + str(symbol_chart_stack[i]) + "\n"
            for j in range(row_length):
                symbol_chart = symbol_chart + "--"
            row_length = 0
            symbol_chart += "\n"
        else:
            symbol_chart += symbol_chart_stack[i]
            row_length += 1
    return {
        "parsed_array": symbol_chart_stack,
        "chart_string": symbol_chart
    }