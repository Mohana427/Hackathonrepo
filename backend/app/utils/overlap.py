from datetime import datetime

def ranges_overlap(start_a: datetime, end_a: datetime, start_b: datetime, end_b: datetime) -> bool:
    """
    Checks if two time ranges overlap.
    A time range is defined as [start, end).
    Overlap condition: startA < endB AND startB < endA.
    Back-to-back bookings (e.g. A ends exactly when B starts) do NOT overlap.
    """
    return start_a < end_b and start_b < end_a
