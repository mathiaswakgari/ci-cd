from celery import shared_task
import time

@shared_task(bind=True)
def test(self):
    
    print("NYR process started....")
        
        
    time.sleep(40)
        
        
    print("NYR process ended....")
    