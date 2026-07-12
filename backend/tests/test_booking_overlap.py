from datetime import datetime
from app.utils.overlap import ranges_overlap

def test_exact_overlap():
    start_a = datetime(2023, 10, 1, 10, 0)
    end_a = datetime(2023, 10, 1, 12, 0)
    start_b = datetime(2023, 10, 1, 10, 0)
    end_b = datetime(2023, 10, 1, 12, 0)
    assert ranges_overlap(start_a, end_a, start_b, end_b) == True

def test_partial_overlap():
    start_a = datetime(2023, 10, 1, 10, 0)
    end_a = datetime(2023, 10, 1, 12, 0)
    start_b = datetime(2023, 10, 1, 11, 0)
    end_b = datetime(2023, 10, 1, 13, 0)
    assert ranges_overlap(start_a, end_a, start_b, end_b) == True

def test_back_to_back():
    start_a = datetime(2023, 10, 1, 10, 0)
    end_a = datetime(2023, 10, 1, 12, 0)
    start_b = datetime(2023, 10, 1, 12, 0)
    end_b = datetime(2023, 10, 1, 14, 0)
    assert ranges_overlap(start_a, end_a, start_b, end_b) == False
    
    # Reverse order
    assert ranges_overlap(start_b, end_b, start_a, end_a) == False

def test_fully_nested():
    start_a = datetime(2023, 10, 1, 10, 0)
    end_a = datetime(2023, 10, 1, 14, 0)
    start_b = datetime(2023, 10, 1, 11, 0)
    end_b = datetime(2023, 10, 1, 12, 0)
    assert ranges_overlap(start_a, end_a, start_b, end_b) == True

def test_no_overlap():
    start_a = datetime(2023, 10, 1, 10, 0)
    end_a = datetime(2023, 10, 1, 12, 0)
    start_b = datetime(2023, 10, 1, 14, 0)
    end_b = datetime(2023, 10, 1, 16, 0)
    assert ranges_overlap(start_a, end_a, start_b, end_b) == False
